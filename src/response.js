import path from 'node:path';
import { statusMessage } from './errors.js';
import { sendFile } from './send.js';

/** Common file-extension -> MIME type mappings used by `res.type()`. */
const EXTENSIONS = {
  html: 'text/html; charset=utf-8',
  htm: 'text/html; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  json: 'application/json; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  ico: 'image/x-icon',
  pdf: 'application/pdf',
  bin: 'application/octet-stream',
};

/**
 * A chainable wrapper around Node's `ServerResponse`.
 *
 * Every mutator returns `this`, so calls can be chained:
 *   res.status(201).type('json').send({ ok: true });
 */
export class Response {
  constructor(raw, req) {
    this.raw = raw;
    this.req = req;
    this.locals = Object.create(null);
  }

  get statusCode() {
    return this.raw.statusCode;
  }
  set statusCode(code) {
    this.raw.statusCode = code;
  }

  get headersSent() {
    return this.raw.headersSent;
  }
  get finished() {
    return this.raw.writableEnded;
  }

  /** Set the HTTP status code. */
  status(code) {
    if (!Number.isInteger(code)) throw new TypeError('status code must be an integer');
    if (code < 100 || code > 999) throw new RangeError(`invalid status code: ${code}`);
    this.raw.statusCode = code;
    return this;
  }

  /** Set a header. Accepts `(name, value)` or a plain object of headers. */
  set(field, value) {
    if (field && typeof field === 'object') {
      for (const key of Object.keys(field)) this.raw.setHeader(key, field[key]);
      return this;
    }
    this.raw.setHeader(field, value);
    return this;
  }

  /** Alias for `set()`. */
  header(field, value) {
    return this.set(field, value);
  }

  /** Append a value to a possibly multi-valued header (e.g. Set-Cookie). */
  append(field, value) {
    const prev = this.raw.getHeader(field);
    if (prev === undefined) return this.set(field, value);
    const next = Array.isArray(prev) ? prev.concat(value) : [prev].concat(value);
    return this.set(field, next);
  }

  /** Read a header that has already been set. */
  get(field) {
    return this.raw.getHeader(field);
  }

  /**
   * Add a field to the `Vary` header without duplicating existing entries.
   */
  vary(field) {
    if (!field) return this;
    const fields = Array.isArray(field) ? field : String(field).split(',').map((s) => s.trim());
    const current = String(this.raw.getHeader('Vary') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const merged = current.slice();
    for (const item of fields) {
      if (!item) continue;
      if (item === '*') return this.set('Vary', '*');
      if (!merged.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
        merged.push(item);
      }
    }
    return this.set('Vary', merged.join(', '));
  }

  /** Set the Content-Type. Accepts a MIME type or a short extension. */
  type(value) {
    let contentType = value;
    if (typeof value === 'string' && !value.includes('/')) {
      contentType = EXTENSIONS[value.replace(/^\./, '').toLowerCase()] || value;
    }
    return this.set('Content-Type', contentType);
  }

  /** Set a cookie. Merges into any existing `Set-Cookie` header. */
  cookie(name, value, options) {
    return this.append('Set-Cookie', serializeCookie(name, value, options));
  }

  /** Expire a cookie. */
  clearCookie(name, options = {}) {
    return this.cookie(name, '', { ...options, expires: new Date(0), maxAge: 0 });
  }

  /** Redirect to another URL. Supports `(url)` and `(status, url)` forms. */
  redirect(url, status = 302) {
    if (typeof url === 'number') {
      [url, status] = [status, url];
    }
    this.set('Location', url);
    return this.status(status).send('');
  }

  /** Send a plain-text response using the reason phrase for `code`. */
  sendStatus(code) {
    return this.status(code).type('text/plain').send(statusMessage(code));
  }

  /**
   * Set `Content-Disposition: attachment` (optionally with a filename) and,
   * when a filename is given, infer the Content-Type from its extension.
   */
  attachment(filename) {
    if (filename) {
      const ext = path.extname(filename).slice(1);
      if (ext) this.type(ext);
      this.set('Content-Disposition', contentDisposition('attachment', filename));
    } else {
      this.set('Content-Disposition', 'attachment');
    }
    return this;
  }

  /** Send a file, optionally as a download. */
  download(filePath, filename, options, callback) {
    if (typeof filename === 'function') {
      callback = filename;
      filename = undefined;
      options = undefined;
    } else if (filename && typeof filename === 'object') {
      callback = options;
      options = filename;
      filename = undefined;
    }
    this.attachment(filename || path.basename(filePath));
    return this.sendFile(filePath, options, callback);
  }

  /** Send a file from disk. Returns a promise (or `this` with a callback). */
  sendFile(filePath, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    const promise = sendFile(this.req, this, path.resolve(filePath), options);
    if (typeof callback === 'function') {
      promise.then(() => callback(null), callback);
      return this;
    }
    return promise;
  }

  /** Content negotiation helper. `obj` maps types to handler functions. */
  format(obj) {
    const keys = Object.keys(obj).filter((key) => key !== 'default');
    const chosen = keys.length ? this.req.accepts(keys) : false;
    this.vary('Accept');
    if (chosen && typeof obj[chosen] === 'function') return obj[chosen]();
    if (typeof obj.default === 'function') return obj.default();
    return this.status(406).send('Not Acceptable');
  }

  /** Send a JSON response. */
  json(value) {
    if (this._alreadySent()) return this;
    if (!this.raw.getHeader('Content-Type')) {
      this.set('Content-Type', 'application/json; charset=utf-8');
    }
    const body = JSON.stringify(value);
    return this.send(body === undefined ? '' : body);
  }

  /**
   * Send a response. Handles strings, Buffers, objects (as JSON) and empty
   * bodies. Content-Type/Content-Length are only set when missing.
   */
  send(body) {
    if (this._alreadySent()) return this;

    if (body === null || body === undefined) {
      if (!this.raw.getHeader('Content-Type')) this.set('Content-Type', 'text/plain; charset=utf-8');
      this.set('Content-Length', '0');
      this.end();
      return this;
    }

    if (Buffer.isBuffer(body)) {
      if (!this.raw.getHeader('Content-Type')) this.set('Content-Type', 'application/octet-stream');
      this.set('Content-Length', String(body.length));
      this._writeBody(body);
      return this;
    }

    if (typeof body === 'object') {
      return this.json(body);
    }

    const str = typeof body === 'string' ? body : String(body);
    if (!this.raw.getHeader('Content-Type')) this.set('Content-Type', 'text/html; charset=utf-8');
    const buffer = Buffer.from(str, 'utf8');
    this.set('Content-Length', String(buffer.length));
    this._writeBody(buffer);
    return this;
  }

  /** Write the body unless this is a HEAD request (headers only). */
  _writeBody(buffer) {
    if (this.req && this.req.method === 'HEAD') {
      this.end();
      return;
    }
    this.end(buffer);
  }

  /** Write a chunk straight to the socket (returns the write result). */
  write(chunk, encoding) {
    return this.raw.write(chunk, encoding);
  }

  /** Direct access to `ServerResponse.end()`. */
  end(chunk, encoding, callback) {
    this.raw.end(chunk, encoding, callback);
    return this;
  }

  /** True once a response has begun (guards against duplicate sends). */
  _alreadySent() {
    return Boolean(this.raw.headersSent || this.raw.writableEnded);
  }
}

/** Serialize a cookie to the `Set-Cookie` header format. */
export function serializeCookie(name, value, options = {}) {
  let encodedValue = value;
  if (value !== null && typeof value === 'object') {
    encodedValue = `j:${JSON.stringify(value)}`;
  }

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(String(encodedValue))}`;

  const cookiePath = options.path === undefined ? '/' : options.path;
  if (cookiePath !== undefined && cookiePath !== null) cookie += `; Path=${cookiePath}`;

  if (options.maxAge != null) {
    const ms = Number(options.maxAge);
    cookie += `; Max-Age=${Math.floor(ms / 1000)}`;
    if (!options.expires) options.expires = new Date(Date.now() + ms);
  }

  if (options.expires) cookie += `; Expires=${new Date(options.expires).toUTCString()}`;
  if (options.domain) cookie += `; Domain=${options.domain}`;
  if (options.secure) cookie += '; Secure';
  if (options.httpOnly) cookie += '; HttpOnly';

  if (options.sameSite) {
    let sameSite = options.sameSite;
    if (sameSite === true) sameSite = 'Strict';
    sameSite = String(sameSite);
    sameSite = sameSite.charAt(0).toUpperCase() + sameSite.slice(1).toLowerCase();
    cookie += `; SameSite=${sameSite}`;
  }

  if (options.partitioned) cookie += '; Partitioned';

  return cookie;
}

function contentDisposition(type, filename) {
  const fallback = String(filename).replace(/["\\]/g, '');
  const encoded = encodeURIComponent(filename);
  return `${type}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
