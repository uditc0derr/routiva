import { escapeRegex, isPromise, safeDecode } from './utils.js';

const CHAIN_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all'];

/**
 * A modular request router.
 *
 * Routes are stored as an ordered list of "layers". Each layer knows how to
 * match a path (exactly for routes, by prefix for middleware) and whether it is
 * an error handler. `handle()` walks the stack Express-style.
 *
 * A Router can be mounted inside another router/app via `use('/prefix', router)`.
 */
export class Router {
  constructor() {
    this.stack = [];
    this.paramCallbacks = new Map();
  }

  _register(method, path, handlers, isMiddleware) {
    if (typeof path !== 'string') {
      handlers = [path, ...handlers];
      path = '/';
    }

    const flat = handlers.flat();
    if (flat.length === 0) {
      throw new TypeError('Router requires at least one handler function');
    }

    const { regex, keys } = compile(path, !isMiddleware);

    for (const fn of flat) {
      if (typeof fn !== 'function' && !(fn instanceof Router)) {
        throw new TypeError('route handler must be a function or Router');
      }
      const handler = fn instanceof Router ? wrapRouter(fn) : fn;
      this.stack.push({
        method,
        path,
        regex,
        keys,
        fn: handler,
        owner: this,
        isMiddleware,
        isErrorHandler: handler.length === 4,
      });
    }
    return this;
  }

  get(path, ...handlers) {
    return this._register('GET', path, handlers, false);
  }
  post(path, ...handlers) {
    return this._register('POST', path, handlers, false);
  }
  put(path, ...handlers) {
    return this._register('PUT', path, handlers, false);
  }
  patch(path, ...handlers) {
    return this._register('PATCH', path, handlers, false);
  }
  delete(path, ...handlers) {
    return this._register('DELETE', path, handlers, false);
  }
  head(path, ...handlers) {
    return this._register('HEAD', path, handlers, false);
  }
  options(path, ...handlers) {
    return this._register('OPTIONS', path, handlers, false);
  }

  /** Register a handler for every HTTP method. */
  all(path, ...handlers) {
    return this._register(null, path, handlers, false);
  }

  /**
   * Register middleware. Optionally mounted under a path prefix.
   */
  use(path, ...handlers) {
    if (typeof path !== 'string') {
      handlers = [path, ...handlers];
      path = '/';
    }
    return this._register(null, path, handlers, true);
  }

  /**
   * Register a callback that runs whenever `name` appears in a matched route's
   * parameters, before the route handlers. Signature: `(req, res, next, value, name)`.
   */
  param(name, fn) {
    if (typeof fn !== 'function') throw new TypeError('param callback must be a function');
    this.paramCallbacks.set(name, fn);
    return this;
  }

  /**
   * Chain handlers for a single path:
   *   router.route('/users').get(list).post(create);
   */
  route(path) {
    const router = this;
    const chain = {};
    for (const method of CHAIN_METHODS) {
      chain[method] = (...handlers) => {
        router[method](path, ...handlers);
        return chain;
      };
    }
    return chain;
  }

  /**
   * Dispatch a request through the stack. `done(err)` is called when the stack
   * is exhausted (either with an error or with none).
   */
  handle(req, res, done) {
    return dispatch(this.stack, req, res, done);
  }
}

/** Adapt a mounted Router into a plain middleware function. */
function wrapRouter(router) {
  return function routerMiddleware(req, res, next) {
    router.handle(req, res, next);
  };
}

function methodAllows(layer, req) {
  if (!layer.method) return true;
  if (layer.method === req.method) return true;
  // A HEAD request is served by a GET route (the body is suppressed later).
  return req.method === 'HEAD' && layer.method === 'GET';
}

function recordAllowed(req, method) {
  if (!req._allowedMethods) req._allowedMethods = new Set();
  req._allowedMethods.add(method);
  if (method === 'GET') req._allowedMethods.add('HEAD');
}

function dispatch(stack, req, res, done) {
  let index = 0;
  let finished = false;

  function next(err) {
    if (finished) return;
    if (index >= stack.length) {
      finished = true;
      return done(err);
    }

    const wantsError = Boolean(err);
    let layer;
    let match;

    while (index < stack.length) {
      layer = stack[index++];
      // Error handlers only run when there is an error, and vice versa.
      if (layer.isErrorHandler !== wantsError) continue;

      match = layer.regex.exec(req.path);
      if (!match) continue;

      if (!methodAllows(layer, req)) {
        if (!layer.isMiddleware) recordAllowed(req, layer.method);
        match = null;
        continue;
      }
      break;
    }

    if (!match) {
      finished = true;
      return done(err);
    }

    invoke(layer, match, err, req, res, next);
  }

  next();
}

function invoke(layer, match, err, req, res, next) {
  const params = {};
  layer.keys.forEach((key, i) => {
    const value = match[i + 1];
    if (value !== undefined) params[key] = safeDecode(value);
  });

  const previous = { params: req.params, path: req.path, url: req.url, route: req.route };
  req.params = { ...previous.params, ...params };
  req.route = layer;

  // Mounted middleware sees the path with its mount prefix removed, like
  // Express sub-apps. The original values are restored on `next()`.
  const consumed = layer.isMiddleware ? match[0].length : 0;
  const stripped = consumed > 0;
  if (stripped) {
    req.path = req.path.slice(consumed) || '/';
    req.url = req.url.slice(consumed) || '/';
    if (req.path[0] !== '/') req.path = `/${req.path}`;
    if (req.url[0] !== '/') req.url = `/${req.url}`;
  }

  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    req.params = previous.params;
    req.route = previous.route;
    if (stripped) {
      req.path = previous.path;
      req.url = previous.url;
    }
  };

  let nextCalled = false;
  const layerNext = (nextErr) => {
    if (nextCalled) return;
    nextCalled = true;
    restore();
    next(nextErr);
  };

  // Collect param callbacks for any named parameters in this layer.
  const steps = [];
  if (layer.owner && layer.owner.paramCallbacks) {
    for (const name of Object.keys(params)) {
      const callback = layer.owner.paramCallbacks.get(name);
      if (callback) {
        const value = params[name];
        steps.push((stepNext) => callback(req, res, stepNext, value, name));
      }
    }
  }

  steps.push((stepNext) => {
    try {
      const ret = layer.isErrorHandler
        ? layer.fn(err, req, res, stepNext)
        : layer.fn(req, res, stepNext);
      if (isPromise(ret)) ret.catch(stepNext);
    } catch (e) {
      stepNext(e);
    }
  });

  runSteps(steps, layerNext);
}

function runSteps(steps, done) {
  let i = 0;
  const stepNext = (stepErr) => {
    if (stepErr) return done(stepErr);
    if (i >= steps.length) return done();
    const step = steps[i++];
    step(stepNext);
  };
  stepNext();
}

/**
 * Compile a path pattern into a RegExp and a list of parameter names.
 * Supports `:named` parameters and `*` wildcards.
 *
 * `end === true`  -> exact match (routes)
 * `end === false` -> prefix match (middleware)
 */
export function compile(pattern, end) {
  if (typeof pattern !== 'string') throw new TypeError('path must be a string');

  let p = pattern === '' ? '/' : pattern;
  if (p[0] !== '/') p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, '');

  const keys = [];
  if (p === '/') {
    return end ? { regex: /^\/?$/, keys } : { regex: /^/, keys };
  }

  const parts = p.split(/(:[A-Za-z0-9_]+|\*)/g).filter((part) => part !== '');
  let source = '';
  for (const part of parts) {
    if (part[0] === ':') {
      keys.push(part.slice(1));
      source += '([^/]+)';
    } else if (part === '*') {
      keys.push('wildcard');
      source += '(.*)';
    } else {
      source += escapeRegex(part);
    }
  }

  if (end) return { regex: new RegExp(`^${source}/?$`), keys };
  return { regex: new RegExp(`^${source}(?=/|$)`), keys };
}
