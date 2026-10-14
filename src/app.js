import http from 'node:http';
import { Router } from './router.js';
import { Request } from './request.js';
import { Response } from './response.js';
import { statusMessage } from './errors.js';

/**
 * The application. Extends Router so it can register routes and middleware,
 * and adds an HTTP server entry point plus default 404/error handling.
 */
export class App extends Router {
  constructor(options = {}) {
    super();

    this.settings = Object.create(null);
    this.set('env', options.env || process.env.NODE_ENV || 'development');
    this.set('trust proxy', options.trustProxy ?? false);
    this.set('x-powered-by', options.xPoweredBy ?? false);
    this.set('json spaces', options.jsonSpaces ?? 0);
    this.set(
      'expose stack',
      options.exposeStack ?? this.setting('env') !== 'production',
    );

    this.server = null;
  }

  /** Read/write an application setting. */
  set(key, value) {
    this.settings[key] = value;
    return this;
  }
  setting(key) {
    return this.settings[key];
  }
  enable(key) {
    return this.set(key, true);
  }
  disable(key) {
    return this.set(key, false);
  }

  /**
   * Entry point used by the HTTP server. Wraps the raw request/response and
   * finishes with a default 404 or error response if nothing handled it.
   */
  _handle(rawReq, rawRes) {
    const req = rawReq instanceof Request ? rawReq : new Request(rawReq, this);
    const res = rawRes instanceof Response ? rawRes : new Response(rawRes, req);

    if (this.setting('x-powered-by')) res.set('X-Powered-By', 'routiva');

    this.handle(req, res, (err) => {
      if (err) this._handleError(err, req, res);
      else this._handleNotFound(req, res);
    });
  }

  /** Create and start an HTTP server. Returns the underlying `http.Server`. */
  listen(...args) {
    if (!this.server) {
      this.server = http.createServer((req, res) => this._handle(req, res));
    }
    return this.server.listen(...args);
  }

  /** Stop the server created by `listen()`. */
  close(callback) {
    if (!this.server) {
      if (callback) callback();
      return this;
    }
    this.server.close(callback);
    return this;
  }

  _handleNotFound(req, res) {
    if (res.raw.headersSent) {
      res.raw.end();
      return;
    }

    // If the path matched but no method did, answer with 405 Method Not Allowed
    // (and auto-handle OPTIONS) listing the allowed methods.
    const allowed = req._allowedMethods;
    if (allowed && allowed.size > 0) {
      const methods = new Set(allowed);
      methods.add('OPTIONS');
      const list = [...methods].sort();
      res.set('Allow', list.join(', '));
      if (req.method === 'OPTIONS') {
        res.status(204).send();
        return;
      }
      res.status(405).json({ error: { message: 'Method Not Allowed', status: 405 } });
      return;
    }

    res.status(404).json({
      error: { message: 'Not Found', status: 404, path: req.originalUrl },
    });
  }

  _handleError(err, req, res) {
    const error = err instanceof Error ? err : new Error(String(err));
    const status = normalizeStatus(error);

    if (res.raw.headersSent) {
      // Headers already flushed; the only safe thing left is to abort.
      res.raw.destroy?.();
      return;
    }

    const expose = this.setting('expose stack');
    const message =
      error.expose || expose ? error.message || statusMessage(status) : statusMessage(status);

    const payload = { error: { message, status } };
    if (error.type) payload.error.type = error.type;
    if (expose && status >= 500 && error.stack) payload.error.stack = error.stack;

    res.status(status).json(payload);
  }
}

function normalizeStatus(err) {
  const status = err && (err.status || err.statusCode);
  return Number.isInteger(status) && status >= 400 && status <= 599 ? status : 500;
}
