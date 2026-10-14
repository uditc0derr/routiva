/**
 * In-memory, IP-based rate limiting middleware.
 *
 * Fixed-window counters keyed by client IP (or a custom key). Sets standard
 * `X-RateLimit-*` headers and responds with 429 + `Retry-After` when the limit
 * is exceeded.
 */
export function rateLimit(options = {}) {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? options.limit ?? 100;
  const statusCode = options.statusCode ?? 429;
  const message = options.message ?? 'Too Many Requests';
  const headers = options.headers !== false;
  const skip = options.skip || (() => false);
  const keyGenerator = options.keyGenerator || defaultKeyGenerator;
  const handler = options.handler;
  const store = options.store || new MemoryStore(windowMs);

  return function limiter(req, res, next) {
    if (skip(req, res)) return next();

    const key = keyGenerator(req, res);
    const record = store.hit(key);
    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil(record.resetTime / 1000);

    if (headers) {
      res.set({
        'X-RateLimit-Limit': String(max),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(resetSeconds),
      });
    }

    if (record.count > max) {
      if (headers) {
        res.set('Retry-After', String(Math.max(1, Math.ceil((record.resetTime - Date.now()) / 1000))));
      }
      if (typeof handler === 'function') return handler(req, res, next, record);
      return res.status(statusCode).json({ error: { message, status: statusCode } });
    }

    next();
  };
}

function defaultKeyGenerator(req) {
  return req.ip || (req.raw && req.raw.socket && req.raw.socket.remoteAddress) || 'unknown';
}

/** A fixed-window counter store backed by a Map. */
export class MemoryStore {
  constructor(windowMs = 60_000) {
    this.windowMs = windowMs;
    this.hits = new Map();
    this.timer = setInterval(() => this.clearExpired(), windowMs);
    if (typeof this.timer.unref === 'function') this.timer.unref();
  }

  /** Record a hit for `key` and return the current window record. */
  hit(key) {
    const now = Date.now();
    let record = this.hits.get(key);
    if (!record || record.resetTime <= now) {
      record = { count: 0, resetTime: now + this.windowMs };
      this.hits.set(key, record);
    }
    record.count += 1;
    return record;
  }

  /** Remove a key, or clear the whole store when no key is given. */
  reset(key) {
    if (key === undefined) this.hits.clear();
    else this.hits.delete(key);
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, record] of this.hits) {
      if (record.resetTime <= now) this.hits.delete(key);
    }
  }

  get size() {
    return this.hits.size;
  }

  /** Stop the background cleanup timer. */
  stop() {
    clearInterval(this.timer);
  }
}
