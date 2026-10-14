/**
 * Request logger middleware.
 *
 * Logs one line per request on the response `finish` event, including method,
 * URL, status code and duration. Customise with `{ stream, format, enabled }`.
 */
export function logger(options = {}) {
  const stream = options.stream || process.stdout;
  const format = options.format;
  const enabled = options.enabled !== false;
  const useColor = options.color ?? Boolean(stream.isTTY);

  return function requestLogger(req, res, next) {
    if (!enabled) return next();

    const raw = res.raw;
    const start = process.hrtime.bigint();
    let logged = false;

    const onFinish = () => {
      if (logged) return;
      logged = true;
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      const line =
        typeof format === 'function'
          ? format(req, res, ms)
          : defaultFormat(req, res, ms, useColor);
      stream.write(`${line}\n`);
    };

    raw.on('finish', onFinish);
    raw.on('close', onFinish);
    next();
  };
}

function defaultFormat(req, res, ms, useColor) {
  const status = useColor ? colorize(res.statusCode) : String(res.statusCode);
  const time = new Date().toISOString();
  return `${time} ${req.method} ${req.originalUrl || req.url} ${status} ${ms.toFixed(1)}ms`;
}

function colorize(status) {
  const color =
    status >= 500 ? 31 : status >= 400 ? 33 : status >= 300 ? 36 : 32;
  return `\x1b[${color}m${status}\x1b[0m`;
}
