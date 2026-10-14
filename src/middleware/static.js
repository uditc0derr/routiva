import path from 'node:path';
import { HttpError } from '../errors.js';
import { sendFile, statFile } from '../send.js';

/**
 * Static file serving middleware.
 *
 *   app.use(serveStatic('public', { maxAge: '1d', index: ['index.html'] }));
 *
 * Only GET/HEAD requests are handled. Missing files fall through to the next
 * middleware unless `{ fallthrough: false }` is set.
 */
export function serveStatic(root, options = {}) {
  const rootDir = path.resolve(root);
  const fallthrough = options.fallthrough !== false;
  const dotfiles = options.dotfiles || 'ignore'; // 'ignore' | 'deny' | 'allow'
  const index = options.index === undefined
    ? ['index.html']
    : options.index === false
      ? []
      : options.index;
  const extensions = options.extensions || [];
  const redirect = options.redirect !== false;

  return function staticMiddleware(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    const resolved = resolveWithin(rootDir, req.path, dotfiles);
    if (resolved === null) return next();
    if (resolved === 'deny') return next(new HttpError(403, 'Forbidden'));

    findFile(resolved, { index, extensions })
      .then((found) => {
        if (!found) {
          if (fallthrough) return next();
          return next(new HttpError(404, 'Not Found'));
        }
        if (found.redirect && redirect) {
          return res.redirect(found.redirect);
        }
        return sendFile(req, res, found.path, options).then(
          () => {},
          (error) => {
            if (error.code === 'ENOENT' && fallthrough) return next();
            next(error);
          },
        );
      })
      .catch(next);
  };
}

/**
 * Resolve a request path inside `root`, guarding against traversal and
 * (optionally) dotfiles. Returns an absolute path, `null` to skip, or `'deny'`.
 */
export function resolveWithin(root, requestPath, dotfiles = 'ignore') {
  let decoded;
  try {
    decoded = decodeURIComponent(requestPath);
  } catch {
    decoded = requestPath;
  }

  if (decoded.includes('\0')) return null;

  const normalized = path.normalize(decoded);
  const absolute = path.join(root, normalized);
  const relative = path.relative(root, absolute);

  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;

  if (dotfiles !== 'allow') {
    const segments = relative.split(path.sep).filter(Boolean);
    if (segments.some((segment) => segment.startsWith('.'))) {
      return dotfiles === 'deny' ? 'deny' : null;
    }
  }

  return absolute;
}

async function findFile(absolute, { index, extensions }) {
  const stat = await statFile(absolute);
  if (stat && stat.isDirectory()) {
    for (const name of index) {
      const candidate = path.join(absolute, name);
      const candidateStat = await statFile(candidate);
      if (candidateStat && candidateStat.isFile()) return { path: candidate };
    }
    return null;
  }
  if (stat && stat.isFile()) return { path: absolute };

  for (const ext of extensions) {
    const candidate = `${absolute}.${ext}`;
    const candidateStat = await statFile(candidate);
    if (candidateStat && candidateStat.isFile()) return { path: candidate };
  }
  return null;
}
