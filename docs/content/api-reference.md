---
title: API reference
description: The complete export list, the App and Router classes, the Request and Response surface, and every middleware factory signature.
section: Reference
order: 1
---

A single-page index of the public API. Each API area links to a page with more
detail and examples.

## Exports

```js
import App, {
  createApp, Router, Request, Response,
  HttpError, statusMessage, STATUS_TEXT,
  json, urlencoded, text, raw,
  logger, rateLimit, MemoryStore,
  serveStatic, cors, compress,
  sendFile, lookupMime,
} from 'routiva';
```

| Export | Kind | Purpose |
| --- | --- | --- |
| `App` | class (also the default export) | The application |
| `createApp(options?)` | function | `new App(options)` |
| `Router` | class | A mountable sub-router |
| `Request` / `Response` | classes | The wrapped `req` / `res` |
| `HttpError` | class | An `Error` with an HTTP status |
| `statusMessage(code)` | function | Canonical reason phrase |
| `STATUS_TEXT` | object | The status-code → reason-phrase map |
| `json` `urlencoded` `text` `raw` | factories | Body parsers |
| `logger` | factory | Request logging |
| `rateLimit` | factory | Fixed-window rate limiting |
| `MemoryStore` | class | The default rate-limit store |
| `serveStatic` | factory | Static file serving |
| `cors` | factory | CORS headers and preflight |
| `compress` | factory | gzip / deflate / brotli |
| `sendFile` | function | Low-level file sender |
| `lookupMime(filePath)` | function | Extension → MIME type |

Every middleware factory is also attached to the class, so you can write
`App.json()`, `App.cors()`, `App.serveStatic()`, and so on.

## App

```js
import { App, createApp } from 'routiva';

const app = createApp({ trustProxy: true });
// identical to: new App({ trustProxy: true })
```

| Member | Description |
| --- | --- |
| `new App(options?)` | Create an app |
| `app.listen(port, [host], [cb])` | Create/start the `http.Server`; returns it |
| `app.close([cb])` | Stop the server; returns `this` |
| `app.handle(req, res, done)` | Dispatch an already-wrapped request |
| `app.set(key, value)` | Set a setting; returns `this` |
| `app.setting(key)` | Read a setting |
| `app.enable(key)` / `app.disable(key)` | Boolean setting helpers |
| `app.get/post/put/patch/delete/head/options/all` | Route registration |
| `app.use([path], ...handlers)` | Middleware / mount a `Router` |
| `app.param(name, fn)` | Parameter callback |
| `app.route(path)` | Chainable method registration |

### App options

| Option | Default | Effect |
| --- | --- | --- |
| `env` | `process.env.NODE_ENV` or `'development'` | Environment name |
| `trustProxy` | `false` | `req.ip` / `req.ips` read `X-Forwarded-For` |
| `xPoweredBy` | `false` | Emit `X-Powered-By: routiva` |
| `jsonSpaces` | `0` | Reserved |
| `exposeStack` | `env !== 'production'` | 5xx messages and stacks in responses |

Settings are the same keys, read and written via `app.setting()` and
`app.set()`. See [Core concepts](core-concepts.md#settings).

## Router

| Member | Description |
| --- | --- |
| `new Router()` | Create a router |
| `router.get/post/put/patch/delete/head/options(path, ...handlers)` | Register a route |
| `router.all(path, ...handlers)` | Route for every method |
| `router.use([path], ...handlers)` | Middleware, optionally prefixed |
| `router.param(name, fn)` | Parameter callback `(req, res, next, value, name)` |
| `router.route(path)` | Chainable builder |
| `router.handle(req, res, done)` | Dispatch a request |
| `router.stack` | The ordered layer array |

Handlers may be functions, arrays of functions, or a `Router`. Mount one with
`app.use('/prefix', router)`. See [Routing](routing.md).

## Request

| Member | Description |
| --- | --- |
| `req.raw` | The underlying `IncomingMessage` |
| `req.app` | The handling `App` |
| `req.method` | HTTP method |
| `req.url` / `req.originalUrl` | Current / original URL |
| `req.path` / `req.search` | Pathname / query string |
| `req.query` | Parsed query (`?tag=a&tag=b` → array) |
| `req.params` | Route parameters |
| `req.body` | Parsed body (from body-parser middleware) |
| `req.cookies` | Parsed cookies (`j:` JSON decoded) |
| `req.headers` | Lower-cased header map |
| `req.hostname` / `req.protocol` / `req.secure` | Derived from headers/socket |
| `req.ip` / `req.ips` | Client IP, honouring `trust proxy` |
| `req.header(name)` / `req.get(name)` | Case-insensitive header lookup |
| `req.accepts(...types)` | Content negotiation |
| `req.is(...types)` | Content-Type test |

Full detail: [Request & Response](request-response.md).

## Response

| Member | Description |
| --- | --- |
| `res.status(code)` | Set the status; chainable |
| `res.set(name, value)` / `res.set(obj)` | Set headers |
| `res.header(...)` | Alias for `set()` |
| `res.append(name, value)` | Append to a multi-value header |
| `res.get(name)` | Read a set header |
| `res.vary(field)` | Add to `Vary`, de-duplicated |
| `res.type(value)` | Set `Content-Type` from a type or extension |
| `res.cookie(name, value, options?)` | Set a cookie |
| `res.clearCookie(name, options?)` | Expire a cookie |
| `res.redirect([status], url)` | Redirect (default `302`) |
| `res.sendStatus(code)` | Status + reason phrase as text |
| `res.attachment(filename?)` | `Content-Disposition: attachment` |
| `res.sendFile(path, options?, cb?)` | Send a file (returns a promise) |
| `res.download(path, filename?, options?, cb?)` | Send as a download |
| `res.format(obj)` | Content-negotiated response |
| `res.json(value)` | JSON response |
| `res.send(body)` | Send string/Buffer/object/empty |
| `res.write(chunk)` / `res.end(...)` | Raw writes |
| `res.raw` | The underlying `ServerResponse` |
| `res.locals` | A per-response data object |
| `res.statusCode` / `res.headersSent` / `res.finished` | State accessors |

Full detail: [Request & Response](request-response.md).

## Middleware factories

### Body parsing

| Factory | Options |
| --- | --- |
| `json({ limit, type, strict, reviver, verify })` | `limit` `'1mb'`, `strict: true` |
| `urlencoded({ limit, extended })` | `limit` `'100kb'`, `extended: false` |
| `text({ limit, type, encoding })` | `limit` `'100kb'`, `encoding: 'utf8'` |
| `raw({ limit, type })` | `limit` `'100kb'`, any type unless `type` is set |

Detail: [Body parsing](body-parsing.md).

### Files

| Factory | Options |
| --- | --- |
| `serveStatic(root, { fallthrough, dotfiles, index, extensions, redirect, maxAge, immutable, etag, headers, type })` | `dotfiles: 'ignore'`, `index: ['index.html']`, `maxAge: 0` |

Detail: [Static files](static-files.md).

### CORS

| Factory | Options |
| --- | --- |
| `cors({ origin, methods, credentials, preflightContinue, optionsSuccessStatus, maxAge, allowedHeaders, exposedHeaders })` | `origin: '*'`, `methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'` |

Detail: [CORS](cors.md).

### Compression

| Factory | Options |
| --- | --- |
| `compress({ threshold, filter, level })` | `threshold: '1kb'`, `filter: () => true` |

Detail: [Compression](compression.md).

### Rate limiting

| Factory | Options |
| --- | --- |
| `rateLimit({ windowMs, max, limit, statusCode, message, headers, skip, keyGenerator, handler, store })` | `windowMs: 60000`, `max: 100` |

Detail: [Rate limiting](rate-limiting.md).

### Logging

| Factory | Options |
| --- | --- |
| `logger({ stream, format, enabled, color })` | `stream: process.stdout`, `enabled: true` |

Detail: [Logging](logging.md).

## Errors

```js
import { HttpError, statusMessage, STATUS_TEXT } from 'routiva';

throw new HttpError(422, 'validation failed', { type: 'validation.failed' });
statusMessage(404);        // 'Not Found'
STATUS_TEXT[500];          // 'Internal Server Error'
```

| `HttpError` member | Description |
| --- | --- |
| `new HttpError(status, message?, options?)` | `options`: `expose`, `type`, `cause` |
| `.status` / `.statusCode` | The status code |
| `.expose` | `status < 500`, or `options.expose` |
| `.type` | Machine-readable code, echoed in responses |
| `HttpError.badRequest(message?, options?)` | `400` |
| `HttpError.unauthorized(...)` | `401` |
| `HttpError.forbidden(...)` | `403` |
| `HttpError.notFound(...)` | `404` |
| `HttpError.methodNotAllowed(...)` | `405` |
| `HttpError.tooLarge(...)` | `413` |
| `HttpError.internal(...)` | `500` |

Detail: [Error handling](error-handling.md).

## Utilities

| Export | Description |
| --- | --- |
| `sendFile(req, res, filePath, options?)` | Low-level file sender (used by `res.sendFile` and `serveStatic`) |
| `lookupMime(filePath)` | Extension → MIME type, falling back to `application/octet-stream` |

```js
lookupMime('app.css');      // 'text/css; charset=utf-8'
lookupMime('photo.webp');   // 'image/webp'
lookupMime('archive.rar');  // 'application/octet-stream'
```

## Default responses

When nothing responds, routiva produces one of:

| Situation | Response |
| --- | --- |
| No path matched | `404` + `{ error: { message, status: 404, path } }` |
| Path matched, wrong method | `405` + `Allow` + JSON error |
| `OPTIONS` on a known path | `204` + `Allow` |
| Unhandled error | `4xx`/`5xx` JSON error from `_handleError` |

## Where to go next

| If you want to… | Read |
| --- | --- |
| A step-by-step build | [Quick start](quick-start.md) |
| How the internals fit together | [Architecture](architecture.md) |
| Runnable code | [Examples](examples.md) |
