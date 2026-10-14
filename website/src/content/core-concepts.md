---
title: Core concepts
description: The mental model behind routiva: the layer stack, next(), the raw wrappers, async errors and app settings.
section: Core concepts
order: 1
---

## The mental model

An app is a router. A router is an ordered list of layers. A layer is a route, a
piece of middleware, or an error handler. A request walks the list from top to
bottom; each layer either responds, passes control with `next()`, or signals a
failure with `next(err)`.

```text
createApp() ─▶ App (extends Router)
                 │
                 └─ stack: [ layer, layer, layer, … ]
                             │
        request ────────────▶ walk top to bottom ─▶ first response wins
```

## App extends Router

`App` is a `Router` with an HTTP server, settings and default responses added.
From `src/app.js`:

```js
export class App extends Router {
  constructor(options = {}) {
    super();
    this.settings = Object.create(null);
    this.set('env', options.env || process.env.NODE_ENV || 'development');
    // ...
  }
}
```

Every routing method — `get`, `post`, `use`, `param`, `route` — is defined on
`Router`, so an app has them all. A `Router` on its own is the building block
for modular sub-routers:

```js
import { Router } from 'routiva';

const api = new Router();
api.get('/status', (req, res) => res.json({ ok: true }));

app.use('/api', api);   // mounted at a prefix
```

## Everything is a layer

Registering a handler pushes one object onto `this.stack`. A route with three
handlers pushes three layers. The shape, from `src/router.js`:

```js
this.stack.push({
  method,               // 'GET' | null (middleware / all)
  path,                 // original pattern, for debugging
  regex,                // compiled matcher, built once
  keys,                 // captured parameter names
  fn: handler,          // the function actually invoked
  owner: this,          // which Router registered it
  isMiddleware,         // prefix match vs exact match
  isErrorHandler: handler.length === 4,
});
```

Routes and middleware share the same array. There is no separate "middleware
phase" and "route phase" — only the order you registered things in. Paths are
compiled to a `RegExp` once, at registration, and reused for every request.

## next() and next(err)

A handler that does not respond must call `next()`. Calling `next(err)` switches
the stack into error mode. `dispatch()` enforces the switch with one comparison
(`src/router.js`, abridged):

```js
function dispatch(stack, req, res, done) {
  let index = 0;
  let finished = false;

  function next(err) {
    if (finished) return;                                 // done() runs once
    if (index >= stack.length) { finished = true; return done(err); }
    const wantsError = Boolean(err);
    let layer, match;
    while (index < stack.length) {
      layer = stack[index++];
      if (layer.isErrorHandler !== wantsError) continue;  // 4-arity ⇔ error mode
      match = layer.regex.exec(req.path);
      if (!match) continue;
      if (!methodAllows(layer, req)) continue;            // HEAD→GET, 405
      break;
    }
    if (!match) { finished = true; return done(err); }
    invoke(layer, match, err, req, res, next);
  }

  next();
}
```

A shared cursor means `next()` from any depth walks forward through the same
list without re-running earlier layers. The `finished` latch guarantees `done`
runs once even if a handler calls `next()` twice.

## Registration order is execution order

A `use()` written before your routes runs first. An error handler written after
your routes can catch their errors; one written before them cannot, because it
has already been passed.

```js
app.use(logger());                 // runs first
app.get('/users', listUsers);      // runs next
app.use((err, req, res, next) => { // runs only if a later layer calls next(err)
  res.status(err.status || 500).json({ error: { message: err.message } });
});
```

## Error handlers are arity 4

The only rule is the function's `length`. Four parameters marks an error
handler; three marks an ordinary handler or middleware. No registration API is
needed.

```js
app.use((req, res, next) => { /* normal */ });     // length === 3
app.use((err, req, res, next) => { /* error */ });  // length === 4
```

If no error handler responds, `App._handleError` builds a JSON error. `HttpError`
sets `expose = status < 500`, so 4xx messages reach the client while 5xx messages
are hidden unless `expose stack` is on:

```js
const expose = this.setting('expose stack');
const message = error.expose || expose ? error.message : statusMessage(status);
res.status(status).json({ error: { message, status } });
```

## Request and Response are thin wrappers

Node's `IncomingMessage` and `ServerResponse` are wrapped once per request. Both
originals stay reachable as `req.raw` and `res.raw`, so the framework never
hides the socket — anything the wrapper does not cover (`req.raw.setTimeout`,
`res.raw.writeHead`) is still one property away.

`Request` parses the URL, query, cookies and client IP in its constructor, so
per-request work happens once. `Response` makes every mutator chainable
(`res.status(201).type('json').send({ ok: true })`) and guards against a second
send by checking `res.raw.headersSent || res.raw.writableEnded`.

## Async handlers

Handlers may return a promise. routiva attaches `.catch(next)` to every returned
promise (`src/router.js`), so a rejection is forwarded to the error chain exactly
like a synchronous throw — no wrapper library needed:

```js
app.get('/data', async (req, res) => {
  const row = await db.get(req.params.id);  // rejection reaches your error handler
  res.json(row);
});
```

This matches Express 5 behaviour. Express 4 only forwarded synchronous throws.

## Settings

`App` stores settings on a null-prototype object. Read them with
`app.setting(key)`, write with `app.set(key, value)` or the boolean helpers
`app.enable(key)` / `app.disable(key)`. Constructor options set the same keys up
front.

| Setting | Default | Effect |
| --- | --- | --- |
| `env` | `process.env.NODE_ENV` or `'development'` | Environment name |
| `trust proxy` | `false` | `req.ip` / `req.ips` read `X-Forwarded-For` |
| `x-powered-by` | `false` | Adds `X-Powered-By: routiva` to responses |
| `json spaces` | `0` | Reserved |
| `expose stack` | `env !== 'production'` | 5xx messages and stack traces in error responses |

```js
const app = createApp({ trustProxy: true, xPoweredBy: false });
app.disable('x-powered-by');
app.set('json spaces', 2);
```

`trust proxy` also accepts a number: with `n`, `req.ip` is taken `n` hops from
the right of `X-Forwarded-For`.

## The request lifecycle

```text
  Client           App._handle            Router.handle          layer            Response
    │  GET /users/1 ─▶│ wrap req/res ──────▶│ dispatch(stack) ─────▶│ handler(req,res) │
    │                 │                     │                      │ res.status/json ▶│
    │◀─────────────────────── 200 application/json ─────────────────────────────────── │
    │                 │◀── done(err) ───────│ (only if nothing responded)
    │                 │  _handleError(err)  or  _handleNotFound(req, res)
```

1. `_handle` wraps the raw request and response.
2. `Router.handle` dispatches the stack, matching methods, params and prefixes.
3. If a layer responds, the request is done.
4. Otherwise `done()` produces a `404`, a `405` with an `Allow` header, or an auto `204` for `OPTIONS`.
5. If an error was raised, `_handleError` produces a safe JSON error instead.

## Why zero dependencies

routiva imports only Node built-ins: `node:http`, `node:url`, `node:fs`,
`node:path`, `node:zlib` and `node:crypto`. That keeps the install tree at one
package and the entire framework in files you can read in an afternoon. The
trade-off is ecosystem size — routing, body parsing, static files, CORS,
compression and rate limiting ship in the core, but template engines, sessions
and third-party plugins do not.
