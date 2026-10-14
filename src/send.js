import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { HttpError } from './errors.js';
import { parseDuration } from './utils.js';

/** A compact extension -> MIME type table. */
export const MIME_TYPES = {
  html: 'text/html; charset=utf-8',
  htm: 'text/html; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  md: 'text/markdown; charset=utf-8',
  json: 'application/json; charset=utf-8',
  map: 'application/json; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  csv: 'text/csv; charset=utf-8',
  yaml: 'text/yaml; charset=utf-8',
  yml: 'text/yaml; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  bmp: 'image/bmp',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
  eot: 'application/vnd.ms-fontobject',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  webm: 'video/webm',
  wasm: 'application/wasm',
  pdf: 'application/pdf',
  zip: 'application/zip',
  gz: 'application/gzip',
  bin: 'application/octet-stream',
};

/** Look up the MIME type for a file path (falls back to octet-stream). */
export function lookupMime(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/** Stat a path, returning `null` for missing files instead of throwing. */
export async function statFile(filePath) {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
}

/** A weak ETag derived from size and mtime. */
function weakEtag(stat) {
  return `W/"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`;
}

/**
 * Send a file at `filePath` to `res`, honouring conditional requests and
 * single-range requests. Resolves to `true` when a response was sent.
 */
export async function sendFile(req, res, filePath, options = {}) {
  const stat = await statFile(filePath);
  if (!stat) throw new HttpError(404, 'Not Found');
  if (stat.isDirectory()) throw new HttpError(404, 'Not Found');

  const size = stat.size;
  const etag = options.etag === false ? null : weakEtag(stat);

  if (options.headers) res.set(options.headers);
  const maxAgeMs = parseDuration(options.maxAge, 0);
  if (maxAgeMs) {
    const maxAge = Math.floor(maxAgeMs / 1000);
    const parts = [`max-age=${maxAge}`];
    if (options.immutable) parts.push('immutable');
    res.set('Cache-Control', `public, ${parts.join(', ')}`);
  }

  res.set('Last-Modified', stat.mtime.toUTCString());
  res.set('Accept-Ranges', 'bytes');
  if (etag) res.set('ETag', etag);
  if (!res.get('Content-Type')) res.type(options.type || lookupMime(filePath));

  if (isFresh(req, etag, stat)) {
    res.status(304).end();
    return true;
  }

  const range = parseRange(req.header('range'), size);
  if (range === 'invalid') {
    res.set('Content-Range', `bytes */${size}`);
    throw new HttpError(416, 'Range Not Satisfiable');
  }

  if (range) {
    const length = range.end - range.start + 1;
    res.status(206);
    res.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
    res.set('Content-Length', String(length));
    if (req.method === 'HEAD') {
      res.end();
      return true;
    }
    await pipeFile(filePath, res, { start: range.start, end: range.end });
    return true;
  }

  res.set('Content-Length', String(size));
  if (req.method === 'HEAD') {
    res.end();
    return true;
  }
  await pipeFile(filePath, res);
  return true;
}

function isFresh(req, etag, stat) {
  const ifNoneMatch = req.header('if-none-match');
  if (ifNoneMatch) {
    if (ifNoneMatch.trim() === '*') return true;
    if (!etag) return false;
    return ifNoneMatch.split(',').some((tag) => tag.trim() === etag);
  }

  const ifModifiedSince = req.header('if-modified-since');
  if (ifModifiedSince) {
    const since = new Date(ifModifiedSince).getTime();
    if (Number.isNaN(since)) return false;
    // Compare at whole-second resolution (HTTP dates have no ms).
    return Math.floor(stat.mtimeMs / 1000) * 1000 <= since;
  }
  return false;
}

/** Parse a single `bytes=` range. Returns `null` when absent, `'invalid'` on error. */
export function parseRange(header, size) {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!match) return null;

  const [, startStr, endStr] = match;
  if (startStr === '' && endStr === '') return null;

  let start;
  let end;
  if (startStr === '') {
    const suffix = parseInt(endStr, 10);
    if (suffix === 0) return 'invalid';
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = parseInt(startStr, 10);
    end = endStr === '' ? size - 1 : Math.min(parseInt(endStr, 10), size - 1);
  }

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) return 'invalid';
  return { start, end };
}

function pipeFile(filePath, res, range) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath, range);
    let settled = false;
    const cleanup = () => {
      stream.off('error', onError);
      res.raw.off('finish', onFinish);
      res.raw.off('error', onError);
    };
    const onError = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      stream.destroy();
      reject(error);
    };
    const onFinish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    stream.on('error', onError);
    res.raw.on('finish', onFinish);
    res.raw.on('error', onError);
    stream.pipe(res.raw);
  });
}
