/**
 * Small, dependency-free helpers shared across the framework.
 */

/** Escape a string so it can be embedded literally inside a RegExp. */
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Turn a `URLSearchParams` instance into a plain object.
 * Repeated keys collapse into an array so `?tag=a&tag=b` is preserved.
 */
export function parseQuery(searchParams) {
  const query = {};
  for (const [key, value] of searchParams) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const current = query[key];
      if (Array.isArray(current)) current.push(value);
      else query[key] = [current, value];
    } else {
      query[key] = value;
    }
  }
  return query;
}

/**
 * Parse a byte-size setting such as `1024`, `'100kb'` or `'1mb'`.
 * Returns `fallback` when the value cannot be understood.
 */
export function parseBytes(value, fallback = 1024 * 1024) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value);
  const match = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i.exec(String(value).trim());
  if (!match) return fallback;
  const amount = parseFloat(match[1]);
  const unit = (match[2] || 'b').toLowerCase();
  const multipliers = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  return Math.floor(amount * multipliers[unit]);
}

/** `decodeURIComponent` that never throws on malformed input. */
export function safeDecode(value) {
  if (value === undefined) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const TIME_UNITS = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 };

/**
 * Parse a duration such as `3000`, `'30s'`, `'10m'`, `'1h'` or `'7d'` into
 * milliseconds. Bare numbers and unit-less strings are treated as milliseconds.
 */
export function parseDuration(value, fallback = 0) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const match = /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d|w)?$/i.exec(String(value).trim());
  if (!match) return fallback;
  const amount = parseFloat(match[1]);
  const unit = (match[2] || 'ms').toLowerCase();
  return Math.floor(amount * (TIME_UNITS[unit] ?? 1));
}

/** True for thenables/promises. */
export function isPromise(value) {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof value.then === 'function'
  );
}

/** No-op used as a default callback. */
export function noop() {}

/** Map of shorthand names to media types, used by content negotiation. */
const SHORTHAND = {
  json: 'application/json',
  html: 'text/html',
  text: 'text/plain',
  xml: 'application/xml',
  js: 'text/javascript',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  form: 'application/x-www-form-urlencoded',
  urlencoded: 'application/x-www-form-urlencoded',
  bin: 'application/octet-stream',
};

/** Turn a shorthand name or full MIME type into a lower-case media type. */
export function toMediaType(value) {
  if (typeof value !== 'string') return null;
  const lower = value.toLowerCase();
  if (lower.includes('/')) return lower;
  return SHORTHAND[lower] || null;
}

/** Parse an `Accept` header into `[{ type, q }]` sorted by quality. */
export function parseAccept(header) {
  return String(header || '*/*')
    .split(',')
    .map((part) => {
      const [type, ...params] = part.split(';').map((segment) => segment.trim());
      let q = 1;
      for (const param of params) {
        const match = /^q=(.+)$/i.exec(param);
        if (match) q = parseFloat(match[1]);
      }
      return { type: type.toLowerCase(), q };
    })
    .filter((entry) => entry.type)
    .sort((a, b) => b.q - a.q);
}

/** True when an `Accept` media range (e.g. `text/*`) matches a candidate. */
export function mediaTypeMatches(range, candidate) {
  if (range === '*/*') return true;
  const [rangeType, rangeSub] = range.toLowerCase().split('/');
  const [candType, candSub] = candidate.toLowerCase().split('/');
  if (rangeType !== candType) return false;
  return rangeSub === '*' || rangeSub === candSub;
}

/** Parse a `Cookie` header into a plain object, decoding `j:` JSON values. */
export function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  for (const part of String(header).split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    if (!key || Object.prototype.hasOwnProperty.call(cookies, key)) continue;
    let value = part.slice(index + 1).trim();
    value = safeDecode(value);
    if (value.startsWith('j:')) {
      try {
        value = JSON.parse(value.slice(2));
      } catch {
        /* keep the raw string when JSON parsing fails */
      }
    }
    cookies[key] = value;
  }
  return cookies;
}
