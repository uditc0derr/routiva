/**
 * HTTP-aware error type plus the canonical reason phrases used for responses.
 */

export const STATUS_TEXT = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  206: 'Partial Content',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  415: 'Unsupported Media Type',
  418: "I'm a Teapot",
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

/** Return the standard reason phrase for a status code. */
export function statusMessage(status) {
  return STATUS_TEXT[status] || 'Error';
}

/**
 * An Error carrying an HTTP status code.
 *
 * Errors with a 4xx status are considered "exposed": their message is safe to
 * send back to the client. 5xx errors hide their message in production.
 */
export class HttpError extends Error {
  constructor(status, message, options = {}) {
    super(message || statusMessage(status));
    this.name = 'HttpError';
    this.status = status;
    this.statusCode = status;
    this.expose = status < 500 || options.expose === true;
    if (options.type) this.type = options.type;
    if (options.cause) this.cause = options.cause;
    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError);
  }

  static badRequest(message, options) {
    return new HttpError(400, message || statusMessage(400), options);
  }
  static unauthorized(message, options) {
    return new HttpError(401, message || statusMessage(401), options);
  }
  static forbidden(message, options) {
    return new HttpError(403, message || statusMessage(403), options);
  }
  static notFound(message, options) {
    return new HttpError(404, message || statusMessage(404), options);
  }
  static methodNotAllowed(message, options) {
    return new HttpError(405, message || statusMessage(405), options);
  }
  static tooLarge(message, options) {
    return new HttpError(413, message || statusMessage(413), options);
  }
  static internal(message, options) {
    return new HttpError(500, message || statusMessage(500), options);
  }
}
