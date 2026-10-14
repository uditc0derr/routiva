/**
 * CORS middleware.
 *
 *   app.use(cors({ origin: 'https://example.com', credentials: true }));
 *
 * `origin` may be a string, an array, `true` (reflect), `'*'`, or a function
 * `(origin, req) => allowedOrigin`. OPTIONS preflight requests are answered
 * automatically unless `{ preflightContinue: true }`.
 */
export function cors(options = {}) {
  const origin = options.origin === undefined ? '*' : options.origin;
  const methods = options.methods || 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const credentials = options.credentials === true;
  const preflightContinue = options.preflightContinue === true;
  const optionsSuccessStatus = options.optionsSuccessStatus || 204;
  const maxAge = options.maxAge;

  return function corsMiddleware(req, res, next) {
    const requestOrigin = req.header('origin');
    const allowOrigin = resolveOrigin(origin, requestOrigin, req, credentials);

    if (allowOrigin) {
      res.set('Access-Control-Allow-Origin', allowOrigin);
      if (allowOrigin !== '*') res.vary('Origin');
      if (credentials) res.set('Access-Control-Allow-Credentials', 'true');
      if (options.exposedHeaders) {
        res.set('Access-Control-Expose-Headers', headerList(options.exposedHeaders));
      }
    }

    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', headerList(methods));
      const allowedHeaders = options.allowedHeaders || req.header('access-control-request-headers');
      if (allowedHeaders) {
        res.set('Access-Control-Allow-Headers', headerList(allowedHeaders));
      }
      if (maxAge != null) res.set('Access-Control-Max-Age', String(maxAge));
      if (preflightContinue) return next();
      return res.status(optionsSuccessStatus).send();
    }

    next();
  };
}

function resolveOrigin(origin, requestOrigin, req, credentials) {
  if (typeof origin === 'function') return origin(requestOrigin, req) || false;
  if (origin === true) return requestOrigin || '*';
  if (origin === '*') {
    // A literal `*` is fine unless credentials are requested, in which case the
    // request origin must be reflected.
    return credentials ? (requestOrigin || '*') : '*';
  }
  if (Array.isArray(origin)) return origin.includes(requestOrigin) ? requestOrigin : false;
  return origin;
}

function headerList(value) {
  return Array.isArray(value) ? value.join(',') : String(value);
}
