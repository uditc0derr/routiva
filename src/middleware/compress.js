import zlib from 'node:zlib';
import { parseBytes } from '../utils.js';

const COMPRESSIBLE = /^(?:text\/|application\/(?:json|javascript|xml|xhtml\+xml|manifest\+json)|image\/svg\+xml)/i;

/**
 * Response compression middleware (gzip/deflate/brotli).
 *
 * Wraps `res.send()` so only fully-buffered responses are compressed; streamed
 * responses (e.g. `res.sendFile`) pass through untouched. Responses smaller
 * than `threshold` are left alone.
 */
export function compress(options = {}) {
  const threshold = parseBytes(options.threshold ?? '1kb', 1024);
  const filter = options.filter || (() => true);
  const level = options.level;

  return function compressMiddleware(req, res, next) {
    if (req.method === 'HEAD' || !filter(req, res)) return next();

    const encoding = selectEncoding(req.header('accept-encoding'));
    if (!encoding) return next();

    const originalSend = res.send.bind(res);

    res.send = function compressedSend(body) {
      if (res.headersSent || res.get('Content-Encoding') || res.get('Cache-Control')?.includes('no-transform')) {
        return originalSend(body);
      }
      if (body === null || body === undefined || (typeof body === 'object' && !Buffer.isBuffer(body))) {
        return originalSend(body);
      }

      const type = res.get('Content-Type') || '';
      if (type && !COMPRESSIBLE.test(type)) return originalSend(body);

      const buffer = Buffer.isBuffer(body) ? body : Buffer.from(String(body), 'utf8');
      if (buffer.length < threshold) return originalSend(body);

      compressBuffer(encoding, buffer, level, (error, compressed) => {
        if (error) return originalSend(body);
        res.vary('Accept-Encoding');
        res.set('Content-Encoding', encoding);
        res.set('Content-Length', String(compressed.length));
        res.raw.end(compressed);
      });
      return res;
    };

    next();
  };
}

function selectEncoding(header) {
  if (!header) return null;
  const accepted = String(header).toLowerCase();
  if (/\bbr\b/.test(accepted)) return 'br';
  if (/\bgzip\b/.test(accepted)) return 'gzip';
  if (/\bdeflate\b/.test(accepted)) return 'deflate';
  if (accepted.includes('*')) return 'gzip';
  return null;
}

function compressBuffer(encoding, buffer, level, callback) {
  if (encoding === 'gzip') return zlib.gzip(buffer, withLevel(level), callback);
  if (encoding === 'deflate') return zlib.deflate(buffer, withLevel(level), callback);
  if (encoding === 'br') return zlib.brotliCompress(buffer, {}, callback);
  return callback(null, buffer);
}

function withLevel(level) {
  return level != null ? { level } : {};
}
