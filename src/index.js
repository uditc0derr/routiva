import { App } from './app.js';
import { Router } from './router.js';
import { Request } from './request.js';
import { Response } from './response.js';
import { HttpError, statusMessage, STATUS_TEXT } from './errors.js';
import { json, raw, text, urlencoded } from './middleware/body-parser.js';
import { logger } from './middleware/logger.js';
import { rateLimit, MemoryStore } from './middleware/rate-limit.js';
import { serveStatic } from './middleware/static.js';
import { cors } from './middleware/cors.js';
import { compress } from './middleware/compress.js';
import { sendFile, lookupMime } from './send.js';

// Convenience statics so middleware can be reached from the App class:
//   App.json(), App.logger(), App.serveStatic() ...
App.json = json;
App.urlencoded = urlencoded;
App.text = text;
App.raw = raw;
App.logger = logger;
App.rateLimit = rateLimit;
App.serveStatic = serveStatic;
App.static = serveStatic;
App.cors = cors;
App.compress = compress;
App.Router = Router;
App.HttpError = HttpError;

/** Create a new application instance. */
export function createApp(options) {
  return new App(options);
}

export {
  App,
  Router,
  Request,
  Response,
  HttpError,
  statusMessage,
  STATUS_TEXT,
  json,
  urlencoded,
  text,
  raw,
  logger,
  rateLimit,
  MemoryStore,
  serveStatic,
  cors,
  compress,
  sendFile,
  lookupMime,
};

export default App;
