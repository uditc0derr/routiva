import {
  mediaTypeMatches,
  parseAccept,
  parseCookies,
  parseQuery,
  toMediaType,
} from './utils.js';

/**
 * A thin, friendly wrapper around Node's `IncomingMessage`.
 *
 * The raw stream is always available as `req.raw`. Parsed values are exposed as
 * `req.params`, `req.query` and `req.body` (the last is populated by the body
 * parsing middleware).
 */
export class Request {
  constructor(raw, app) {
    this.raw = raw;
    this.app = app;

    this.method = raw.method;
    this.headers = raw.headers;
    this.url = raw.url;
    this.originalUrl = raw.url;

    this.params = {};
    this.body = undefined;

    const parsed = new URL(raw.url, 'http://localhost');
    this.path = parsed.pathname;
    this.search = parsed.search;
    this.query = parseQuery(parsed.searchParams);
    this.cookies = parseCookies(this.headers.cookie);

    const host = this.headers.host;
    this.hostname = host ? String(host).split(':')[0] : undefined;
    this.protocol = this.secure ? 'https' : 'http';
    this.ip = this._resolveIp();
    this.ips = this._resolveIps();
  }

  /** Returns the first forwarded IP when behind a trusted proxy. */
  _resolveIps() {
    const trust = this.app && typeof this.app.setting === 'function'
      ? this.app.setting('trust proxy')
      : false;
    if (!trust) return [];
    const header = this.headers['x-forwarded-for'];
    if (!header) return [];
    return String(header)
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  _resolveIp() {
    const direct = this.raw.socket && this.raw.socket.remoteAddress;
    const ips = this._resolveIps();
    if (ips.length === 0) return direct;

    const trust = this.app.setting('trust proxy');
    if (trust === true) return ips[0];
    if (typeof trust === 'number') {
      const index = ips.length - 1 - trust;
      return ips[index] || ips[0] || direct;
    }
    return direct;
  }

  get secure() {
    const proto = this.headers['x-forwarded-proto'];
    if (proto) return String(proto).split(',')[0].trim() === 'https';
    return Boolean(this.raw.socket && this.raw.socket.encrypted);
  }

  /** Case-insensitive header lookup. */
  header(name) {
    return this.headers[String(name).toLowerCase()];
  }

  /** Alias for `header()`. */
  get(name) {
    return this.header(name);
  }

  /**
   * Content negotiation against the request's `Accept` header.
   *
   * With no arguments, returns the raw `Accept` value. Otherwise returns the
   * first of the supplied types (or `false`) that the client accepts.
   */
  accepts(...types) {
    if (types.length === 1 && Array.isArray(types[0])) types = types[0];
    if (types.length === 0) return this.header('accept') || '*/*';

    const accepted = parseAccept(this.header('accept'));
    const candidates = types.map((type) => toMediaType(type) || String(type).toLowerCase());

    for (const { type } of accepted) {
      for (let i = 0; i < candidates.length; i += 1) {
        if (mediaTypeMatches(type, candidates[i])) return types[i];
      }
    }
    return false;
  }

  /** True when the request `Content-Type` matches one of the given types. */
  is(...types) {
    let list = types;
    if (types.length === 1 && Array.isArray(types[0])) list = types[0];

    const raw = (this.header('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!raw) return list.includes(null) || list.includes(undefined);

    return list.some((type) => {
      const media = (toMediaType(type) || String(type)).toLowerCase();
      if (media.endsWith('/*')) return raw.startsWith(media.slice(0, -1));
      return raw === media || raw.startsWith(`${media}+`);
    });
  }
}
