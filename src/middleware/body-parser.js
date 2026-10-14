import { HttpError } from '../errors.js';
import { parseBytes } from '../utils.js';

/**
 * JSON body parser middleware.
 *
 * Reads and parses `application/json` request bodies into `req.body`, enforcing
 * an optional size limit. Malformed JSON produces a 400, oversized bodies a 413.
 */
export function json(options = {}) {
  const limit = parseBytes(options.limit, 1024 * 1024);
  const expected = String(options.type || 'application/json').toLowerCase();
  const strict = options.strict !== false;
  const reviver = options.reviver;
  const verify = options.verify;

  return function jsonParser(req, res, next) {
    if (req.body !== undefined) return next();
    if (!hasBody(req) || !typeMatches(req, expected)) return next();

    readBuffer(req.raw, limit)
      .then((buffer) => {
        const raw = buffer.toString('utf8');
        if (raw.length === 0) {
          req.body = {};
          return next();
        }
        if (strict) {
          const first = raw.trim()[0];
          if (first !== '{' && first !== '[') {
            return next(parseFailure(new Error('JSON body must be an object or array'), raw));
          }
        }
        if (typeof verify === 'function') verify(req, res, buffer, 'utf-8');
        try {
          req.body = JSON.parse(raw, reviver);
        } catch (e) {
          return next(parseFailure(e, raw));
        }
        next();
      })
      .catch(next);
  };
}

/**
 * URL-encoded body parser middleware (`application/x-www-form-urlencoded`).
 * Pass `{ extended: true }` to decode bracket notation into nested objects.
 */
export function urlencoded(options = {}) {
  const limit = parseBytes(options.limit, 100 * 1024);
  const expected = 'application/x-www-form-urlencoded';
  const extended = options.extended === true;

  return function urlencodedParser(req, res, next) {
    if (req.body !== undefined) return next();
    if (!hasBody(req) || !typeMatches(req, expected)) return next();

    readBuffer(req.raw, limit)
      .then((buffer) => {
        const body = {};
        for (const [key, value] of new URLSearchParams(buffer.toString('utf8'))) {
          if (extended) assignNested(body, key, value);
          else body[key] = value;
        }
        req.body = body;
        next();
      })
      .catch(next);
  };
}

/** Plain-text body parser: assigns the decoded string to `req.body`. */
export function text(options = {}) {
  const limit = parseBytes(options.limit, 100 * 1024);
  const expected = String(options.type || 'text/plain').toLowerCase();
  const encoding = options.encoding || 'utf8';

  return function textParser(req, res, next) {
    if (req.body !== undefined) return next();
    if (!hasBody(req) || !typeMatches(req, expected)) return next();

    readBuffer(req.raw, limit)
      .then((buffer) => {
        req.body = buffer.toString(encoding);
        next();
      })
      .catch(next);
  };
}

/** Raw body parser: assigns the Buffer to `req.body`. */
export function raw(options = {}) {
  const limit = parseBytes(options.limit, 100 * 1024);
  const expected = String(options.type || 'application/octet-stream').toLowerCase();

  return function rawParser(req, res, next) {
    if (req.body !== undefined) return next();
    if (!hasBody(req)) return next();
    if (options.type && !typeMatches(req, expected)) return next();

    readBuffer(req.raw, limit)
      .then((buffer) => {
        req.body = buffer;
        next();
      })
      .catch(next);
  };
}

function assignNested(target, path, value) {
  const keys = path.replace(/\]/g, '').split('[');
  let cursor = target;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (typeof cursor[key] !== 'object' || cursor[key] === null) cursor[key] = {};
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
}

function parseFailure(cause, raw) {
  const error = new HttpError(400, cause.message, { type: 'entity.parse.failed' });
  error.body = raw;
  error.cause = cause;
  return error;
}

function hasBody(req) {
  const raw = req.raw || req;
  if (raw.headers['transfer-encoding'] !== undefined) return true;
  const length = raw.headers['content-length'];
  return length !== undefined && Number(length) > 0;
}

function typeMatches(req, expected) {
  const contentType = (req.header('content-type') || '').toLowerCase();
  return contentType.includes(expected);
}

function readBuffer(stream, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let settled = false;

    const cleanup = () => {
      stream.off('data', onData);
      stream.off('end', onEnd);
      stream.off('error', onError);
    };
    const onData = (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > limit) {
        settled = true;
        cleanup();
        // Drain any remaining data so the socket stays in a writable state and
        // the 413 response can still be delivered.
        stream.resume();
        reject(new HttpError(413, 'Request entity too large', { type: 'entity.too.large' }));
        return;
      }
      chunks.push(chunk);
    };
    const onEnd = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(Buffer.concat(chunks));
    };
    const onError = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onError);
  });
}
