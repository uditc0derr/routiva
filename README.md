# routiva

[![CI](https://github.com/uditc0derr/routiva/actions/workflows/ci.yml/badge.svg)](https://github.com/uditc0derr/routiva/actions/workflows/ci.yml)

> A lightweight, **zero-dependency** Express.js alternative built directly on
> Node's `node:http`. Routing, middleware, request/response helpers, error
> handling, body parsing, static files, CORS, compression, logging and rate
> limiting — in ~1,900 lines you can read in an afternoon.

Requires **Node.js 18+**. No runtime dependencies. No dev dependencies.

---

## Table of contents

1. [What is routiva?](#what-is-routiva)
2. [Quick start](#quick-start)
3. [Core concepts](#core-concepts)
4. [Architecture](#architecture)
   - [High-level map](#high-level-map)
   - [Request lifecycle](#request-lifecycle)
   - [Module dependency graph](#module-dependency-graph)
   - [Module reference](#module-reference)
   - [The layer stack](#the-layer-stack)
   - [Path matching](#path-matching)
   - [Dispatch and `next()`](#dispatch-and-next)
   - [Params, mount prefixes and restoration](#params-mount-prefixes-and-restoration)
   - [Error handling by arity](#error-handling-by-arity)
   - [The Request wrapper](#the-request-wrapper)
   - [The Response wrapper](#the-response-wrapper)
   - [Body parsing pipeline](#body-parsing-pipeline)
   - [File sending](#file-sending)
   - [Settings and environment](#settings-and-environment)
   - [404 / 405 / OPTIONS](#404--405--options)
5. [New features in depth](#new-features-in-depth)
6. [API reference](#api-reference)
7. [Advantages over Express](#advantages-over-express)
8. [Where Express still wins](#where-express-still-wins)
9. [Performance notes](#performance-notes)
10. [Extending routiva](#extending-routiva)
11. [Testing](#testing)
12. [Project structure](#project-structure)
13. [Design principles](#design-principles)
14. [Roadmap](#roadmap)
15. [License](#license)

---

## What is routiva?

routiva is a small web framework that reimplements the parts of Express people
actually use, using **only Node built-ins**. It gives you the ergonomics of
Express:

```js
app.get('/users/:id', (req, res) => {
  res.status(200).json({ id: req.params.id });
});
```

…but the entire implementation is local, auditable and dependency-free. That
makes it a good fit for:

- **Learning** how HTTP frameworks work under the hood.
- **Edge / serverless / embedded** environments where dependency graph size and
  cold-start cost matter.
- **Internal services** that only need routing, parsing, logging and limits.
- **A base to fork** when you want a framework you fully understand.

If you need template engines, sessions, a plugin ecosystem and thousands of
community middlewares, use Express. If you want a transparent core you can read
top to bottom, routiva is that.

---

## Quick start

```bash
npm install routiva
```

```js
import { App } from 'routiva';

const app = new App();

app.use(App.logger());
app.use(App.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, query: req.query });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

> Working from a clone instead? `node examples/basic.js` runs the demo app and
> `npm test` runs the test suite.

---

## Core concepts

Before diving into the internals, five ideas carry the whole design:

| Concept | Meaning |
| --- | --- |
| **App extends Router** | `App` *is* a `Router` plus server lifecycle, settings and default responses. Everything a router can do, an app can do. |
| **Everything is a layer** | Routes, middleware and error handlers are pushed onto one ordered array (`stack`) as "layers". Order of registration is execution order. |
| **`next(err)` is the only control flow** | Handlers either finish the response or call `next()`. Calling `next(err)` switches the stack into error-handling mode. |
| **The raw objects are wrapped** | Node's `IncomingMessage`/`ServerResponse` become `Request`/`Response` classes, always reachable via `req.raw` / `res.raw`. |
| **Zero dependencies** | Only `node:http`, `node:url`, `node:fs`, `node:zlib`, `node:path`, `node:crypto` are ever imported. |

---

## Architecture

### High-level map

```
                Client
                  │  HTTP request
                  ▼
        node:http · http.createServer(handler)
                  │  IncomingMessage + ServerResponse
                  ▼
        App._handle(rawReq, rawRes)
          ├─ wrap:  new Request(raw)  +  new Response(raw, req)
          └─ this.handle(req, res, done)
                  │
                  ▼
        Router.handle → dispatch(this.stack)
          ├─ logger()            → next()
          ├─ json()              → next()
          ├─ GET /users/:id      → res.json(...)      ← responds
          ├─ POST /users         → next()
          ├─ (err,req,res,next)  → only after next(err)
          └─ serveStatic()       → next()
                  │  stack exhausted
                  ▼
        done(err)
          ├─ err  → _handleError(err)   → 4xx / 5xx JSON
          └─ none → _handleNotFound()   → 404 / 405 / OPTIONS
```

The request enters at `_handle`, is wrapped, and then flows through a single
ordered list of layers. Each layer decides to handle the request, pass control
onward with `next()`, or raise an error with `next(err)`. When the stack is
exhausted, `done(err)` decides between an error response and a 404/405.

### Request lifecycle

```
  Client                 App._handle            dispatch()         middleware / route       Response
    │                        │                     │                      │                     │
    │  GET /users/1?x=1 ───▶ │                     │                      │                     │
    │                        │  wrap req/res ─────▶│                      │                     │
    │                        │                     │  find next layer ───▶│                     │
    │                        │                     │                      │  req.query/params   │
    │                        │                     │                      │  res.status(200) ─▶ │
    │                        │                     │                      │  res.json(body) ──▶ │
    │◀──────────────────────────── 200 application/json ───────────────────────────────────────  │
    │                        │◀── done(err) ───────│  (only if nothing responded)              │
    │                        │  _handleError / _handleNotFound                                          │
```

Key invariants:

- A layer **may** respond and **may** call `next()`, but a response can only be
  written once (`Response._alreadySent()` guards this).
- If every layer passes the request along without responding, `done()` produces
  the default 404, 405 or OPTIONS response.
- If any layer calls `next(err)` (or throws, or rejects), the stack switches to
  error layers; if none handle it, `_handleError` produces a safe error response.

### Module dependency graph

```
  index.js ─────────────────────────────────────────────── public API + statics
     │
     ├── app.js ──────────▶ router.js ──▶ utils.js
     │      │
     │      ├────────────▶ request.js ──▶ utils.js
     │      │
     │      ├────────────▶ response.js ──▶ send.js ──▶ errors.js, utils.js
     │      │                     └──────▶ errors.js
     │      └────────────▶ errors.js
     │
     └── middleware/
            ├── body-parser.js ──▶ errors.js, utils.js
            ├── static.js ───────▶ send.js, errors.js
            ├── cors.js
            ├── compress.js ─────▶ utils.js, node:zlib
            ├── logger.js
            └── rate-limit.js
```

The graph is acyclic and shallow. `errors.js` and `utils.js` are leaves;
`send.js` is the only shared low-level utility used by two entry points
(`res.sendFile` and `serveStatic`).

### Module reference

| Module | Lines | Responsibility |
| --- | ---: | --- |
| `src/index.js` | 56 | Public entry point; attaches middleware factories as `App` statics |
| `src/app.js` | 129 | `App`: server lifecycle, settings, default 404/405/error handling |
| `src/router.js` | 301 | `Router`: layer stack, path compilation, dispatch, `param`/`route`/`use` |
| `src/request.js` | 121 | `Request` wrapper: URL, query, cookies, IP, content negotiation |
| `src/response.js` | 305 | `Response` wrapper: chainable helpers, cookies, send, sendFile, format |
| `src/send.js` | 196 | File sending: MIME lookup, ETag, `Last-Modified`, Range, streaming |
| `src/errors.js` | 84 | `HttpError` + HTTP reason phrases |
| `src/utils.js` | 154 | Query/cookie/accept parsing, byte & duration parsing, regex escaping |
| `src/middleware/body-parser.js` | 183 | `json()`, `urlencoded()`, `text()`, `raw()` |
| `src/middleware/static.js` | 101 | `serveStatic()` with traversal protection and fallthrough |
| `src/middleware/cors.js` | 60 | `cors()` with preflight handling |
| `src/middleware/compress.js` | 73 | `compress()` via gzip / deflate / brotli |
| `src/middleware/logger.js` | 47 | `logger()` request logging |
| `src/middleware/rate-limit.js` | 93 | `rateLimit()` + `MemoryStore` fixed windows |

### The layer stack

`Router` holds a single array, `this.stack`. Registering anything pushes one
layer per handler function:

```js
// src/router.js — _register() (abridged)
const { regex, keys } = compile(path, !isMiddleware);   // compiled once, shared
for (const fn of flat) {
  const handler = fn instanceof Router ? wrapRouter(fn) : fn;
  this.stack.push({
    method,                       // 'GET' | null (middleware / all)
    path,                         // original pattern, for debugging
    regex,                        // compiled matcher
    keys,                         // captured parameter names
    fn: handler,                  // the function actually invoked
    owner: this,                  // which Router registered it (for param callbacks)
    isMiddleware,                 // prefix match vs exact match
    isErrorHandler: handler.length === 4,   // arity-based classification
  });
}
```

Because routes and middleware live in the same list, **registration order is
execution order** — exactly like Express. A `use()` before your routes runs
first; an error handler registered after your routes can catch their errors; an
error handler registered before them cannot (it has already been passed).

### Path matching

Patterns are compiled to a `RegExp` once, at registration time, and reused for
every request. `compile(pattern, end)` in `src/router.js`:

```
/                     end → /^\/?$/              prefix → /^/
/users/:id            end → /^\/users\/([^/]+)\/?$/
/files/*              end → /^\/files\/(.*)\/?$/
/users                prefix → /^\/users(?=\/|$)/
```

The algorithm:

1. Normalise leading/trailing slashes.
2. Split the pattern on `:name` and `*` tokens (keeping the literals).
3. Literals are regex-escaped (`escapeRegex`); `:name` becomes `([^/]+)` and
   captures a single path segment; `*` becomes `(.*)` and captures the rest.
4. `end: true` anchors with `^…\/?$` (trailing slash tolerated), producing an
   **exact** match for routes.
5. `end: false` uses a lookahead, `^…(?=\/|$)`, producing a **prefix** match for
   mounted middleware without consuming the next `/`.

The `keys` array records parameter names in capture order, so `invoke()` can
zip `match[1..n]` back onto names:

```js
layer.keys.forEach((key, i) => {
  const value = match[i + 1];
  if (value !== undefined) params[key] = safeDecode(value);  // URL-decode captures
});
```

`safeDecode` wraps `decodeURIComponent` so a malformed `%` never throws a 500.

| Pattern | Request | Match? | `req.params` |
| --- | --- | --- | --- |
| `/users/:id` | `/users/42` | ✅ | `{ id: '42' }` |
| `/users/:id` | `/users/42/posts` | ❌ | — |
| `/users/:id` | `/users/a%20b` | ✅ | `{ id: 'a b' }` |
| `/files/*` | `/files/a/b/c.txt` | ✅ | `{ wildcard: 'a/b/c.txt' }` |
| `/users` (prefix) | `/users/42` | ✅ prefix | — |

### Dispatch and `next()`

All dispatching lives in one function, `dispatch(stack, req, res, done)`. It uses
a **shared cursor** (`index`) plus a `finished` latch, so `next()` calls from any
depth walk the same list without re-running earlier layers:

```js
// src/router.js — dispatch() (abridged)
function dispatch(stack, req, res, done) {
  let index = 0;
  let finished = false;

  function next(err) {
    if (finished) return;                          // one terminal transition only
    if (index >= stack.length) {
      finished = true;
      return done(err);                            // stack exhausted
    }

    const wantsError = Boolean(err);
    let layer, match;

    while (index < stack.length) {
      layer = stack[index++];
      if (layer.isErrorHandler !== wantsError) continue;   // error ⇔ 4-arity only

      match = layer.regex.exec(req.path);
      if (!match) continue;

      if (!methodAllows(layer, req)) {                      // HEAD→GET fallback
        if (!layer.isMiddleware) recordAllowed(req, layer.method);
        match = null;
        continue;
      }
      break;
    }

    if (!match) { finished = true; return done(err); }
    invoke(layer, match, err, req, res, next);
  }

  next();
}
```

Why a `while` loop instead of recursion? It keeps stack depth O(1) per `next()`
call and guarantees the cursor never moves backwards. `finished` ensures `done`
is called exactly once even if a handler misbehaves and calls `next()`
repeatedly.

### Params, mount prefixes and restoration

`invoke()` is where a layer actually runs. It performs four careful steps:

**1. Build and merge params** (child params shadow parent params).

**2. Strip the mount prefix** for middleware. If you register
`app.use('/api', router)`, the layer's prefix regex consumes `/api`; the router
temporarily rewrites `req.path`/`req.url` so the inner router sees `/hello`, not
`/api/hello` — mirroring Express sub-app behaviour.

**3. Restore on `next()`.** The previous `params`/`path`/`url`/`route` are saved
and restored the first time the layer calls `next()`. A `nextCalled` latch
ignores duplicate `next()` calls:

```js
const previous = { params: req.params, path: req.path, url: req.url, route: req.route };
req.params = { ...previous.params, ...params };
req.route = layer;

const consumed = layer.isMiddleware ? match[0].length : 0;   // prefix length
if (consumed > 0) { /* req.path = req.path.slice(consumed) ... */ }

let restored = false;
const restore = () => { if (restored) return; restored = true; /* undo all */ };

let nextCalled = false;
const layerNext = (nextErr) => {
  if (nextCalled) return;      // guard against double next()
  nextCalled = true;
  restore();
  next(nextErr);
};
```

**4. Run param callbacks, then the handler**, with sync/async error capture:

```js
const steps = [];   // param callbacks for this layer's params (if any)
// ... one (stepNext) => callback(req, res, stepNext, value, name) per param
steps.push((stepNext) => {
  try {
    const ret = layer.isErrorHandler
      ? layer.fn(err, req, res, stepNext)      // 4-arity: (err, req, res, next)
      : layer.fn(req, res, stepNext);          // 3-arity: (req, res, next)
    if (isPromise(ret)) ret.catch(stepNext);   // async throws → error chain
  } catch (e) {
    stepNext(e);                                // sync throws → error chain
  }
});
runSteps(steps, layerNext);
```

This is why **both** `throw` and `Promise.reject` reach your error middleware —
Express 4 only routed synchronous throws, requiring wrapper libraries.

### Error handling by arity

Error handlers are ordinary functions whose `length === 4`:

```js
app.use((err, req, res, next) => { /* ... */ });
```

The dispatch loop selects layers with `layer.isErrorHandler !== wantsError`, so
4-arity functions are skipped during normal flow and 3-arity functions are
skipped during error flow. This matches Express exactly and needs no
registration API.

If no error handler responds, `App._handleError` runs:

```js
// src/app.js — _handleError() (abridged)
const status = normalizeStatus(error);          // err.status/statusCode, else 500
if (res.raw.headersSent) { res.raw.destroy?.(); return; }   // cannot recover

const expose = this.setting('expose stack');    // default: non-production
const message = error.expose || expose ? error.message : statusMessage(status);
res.status(status).json({ error: { message, status, type: error.type } });
```

`HttpError` sets `expose = status < 500`, so 4xx messages are shown to clients
while 5xx messages are hidden in production (stack traces are included only when
`expose stack` is on).

### The Request wrapper

`Request` lifts the fiddly parts of `IncomingMessage` into plain fields, parsed
once in the constructor so per-request work is O(1) afterwards:

| Field | Source |
| --- | --- |
| `raw` | the underlying `IncomingMessage` |
| `method`, `headers`, `url`, `originalUrl` | copied from `raw` |
| `path`, `search`, `query` | `new URL(raw.url, 'http://localhost')` |
| `cookies` | `parseCookies(raw.headers.cookie)` |
| `hostname`, `protocol`, `secure` | derived from headers/socket |
| `ip`, `ips` | resolved with `trust proxy` |
| `params` | set by the router during dispatch |
| `body` | set by body-parser middleware |

```js
const parsed = new URL(raw.url, 'http://localhost');  // base is irrelevant
this.path = parsed.pathname;                          // path only
this.query = parseQuery(parsed.searchParams);         // repeated keys → arrays
this.cookies = parseCookies(this.headers.cookie);
```

`parseQuery` collapses `?tag=a&tag=b` into `{ tag: ['a','b'] }`. `req.accepts()`
and `req.is()` use the shared negotiation helpers in `utils.js`.

### The Response wrapper

`Response` wraps `ServerResponse` and makes every mutator return `this`:

```js
res.status(201).type('json').send({ ok: true });   // fully chainable
```

The important safety mechanic is the **double-send guard**:

```js
send(body) {
  if (this._alreadySent()) return this;   // headersSent || writableEnded
  // ...set Content-Type/Content-Length, then write
}
_alreadySent() {
  return Boolean(this.raw.headersSent || this.raw.writableEnded);
}
```

A stray second `res.json()` is silently ignored rather than crashing with
`ERR_HTTP_HEADERS_SENT`. `send()` dispatches by type:

| Body | Behaviour |
| --- | --- |
| `null` / `undefined` | empty body, `Content-Length: 0` |
| `Buffer` | `application/octet-stream`, raw bytes |
| object | delegates to `json()` |
| string / number | `text/html`, `Content-Length` set explicitly |

`_writeBody()` suppresses the payload for `HEAD` requests while still computing
`Content-Length`, so `HEAD` reuses `GET` routes correctly.

`res.raw` is always exposed for anything the wrapper doesn't cover.

### Body parsing pipeline

All four parsers (`json`, `urlencoded`, `text`, `raw`) share one streaming
reader, `readBuffer(stream, limit)`:

```
request stream ──data──▶ size += chunk.length
                          │
                          ├─ size > limit ─▶ resume() drain + reject HttpError(413)
                          └─ else         ─▶ chunks.push(chunk)
                                             │
                                        end ─▶ Buffer.concat(chunks)
```

Highlights:

- **Size limits** are parsed from human strings (`'1mb'`, `'100kb'`) by
  `parseBytes`.
- On overflow the stream is **drained** (`resume()`) rather than destroyed, so
  the socket stays writable and the `413` response can actually be delivered.
- `json()` adds a **strict** check (must start with `{` or `[`) and wraps parse
  failures in a `400` with `type: 'entity.parse.failed'`.
- Content-type gating means each parser ignores bodies it doesn't own, so you
  can stack them.
- `verify`/`reviver` hooks are supported for `json()`.

### File sending

`src/send.js` is shared by `res.sendFile()` and `serveStatic()`. It implements
the conditional-request and range semantics of a static server:

```
stat file ──▶ set Last-Modified, Accept-Ranges, ETag (W/"size-mtime")
              │
              ├─ If-None-Match / If-Modified-Since fresh? ─▶ 304
              ├─ Range: bytes=a-b ─▶ 206 + Content-Range, stream that slice
              ├─ bad range ─▶ 416 + Content-Range: bytes */size
              ├─ maxAge ─▶ Cache-Control: public, max-age=…[, immutable]
              └─ else ─▶ 200 + Content-Length, stream the file
```

`serveStatic()` layers on top:

- **Traversal protection** via `resolveWithin()` — decode, `path.normalize`,
  then verify `path.relative(root, abs)` doesn't escape.
- **Dotfiles** policy: `ignore` (fall through), `deny` (403) or `allow`.
- **Index files** for directories and optional **extension fallback**.
- **Fallthrough**: misses call `next()` (so SPA routes work) unless
  `{ fallthrough: false }`.

### Settings and environment

`App` keeps a null-prototype `settings` object:

| Setting | Default | Effect |
| --- | --- | --- |
| `env` | `NODE_ENV`/`development` | Environment name |
| `trust proxy` | `false` | `req.ip`/`req.ips` use `X-Forwarded-For` |
| `x-powered-by` | `false` | Emit `X-Powered-By: routiva` |
| `expose stack` | non-production | 5xx messages + stack traces in responses |
| `json spaces` | `0` | (reserved) |

Set them via `app.set(key, value)`, `app.enable(key)`, `app.disable(key)`.
`setting(key)` reads them, and `Request` consults `app.setting('trust proxy')`
to resolve the client IP.

### 404 / 405 / OPTIONS

When the stack is exhausted without an error, `_handleNotFound` runs:

```
allowed = req._allowedMethods            // recorded when a path matched, method didn't
   │
   ├─ has entries?
   │     ├─ method === OPTIONS ─▶ 204 + Allow: GET, HEAD, OPTIONS, POST, …
   │     └─ otherwise          ─▶ 405 + Allow header + JSON error
   │
   └─ none ─▶ 404 JSON { error: { message, status, path } }
```

This is stricter than Express (which generally returns 404 for a wrong method)
and correct per RFC 9110.

---

## New features in depth

These are the capabilities added beyond the original routing core, each with the
internals that make it work.

### 1. Static file serving — `serveStatic(root, options)`

```js
app.use(serveStatic('public', { maxAge: '1h', immutable: true, extensions: ['html'] }));
```

- Streams files with `createReadStream` (constant memory, no buffering).
- `ETag`, `Last-Modified`, conditional `304`, and single-range `206`/`416`.
- `Content-Type` from a built-in extension table plus a `Cache-Control` policy.
- Directory indexes, extension fallback, dotfile policy and safe fallthrough.
- Traversal-proof: `..%2f..%2fetc%2fpasswd` resolves outside the root and is
  rejected.

### 2. `res.sendFile()` / `res.download()` / `res.attachment()`

```js
app.get('/report', (req, res) => res.download('reports/q3.pdf'));
```

Shares the exact `send.js` engine as static serving, adds
`Content-Disposition` (with RFC 5987 `filename*` encoding for non-ASCII names),
and surfaces missing files into the error chain as `HttpError(404)`.

### 3. Content negotiation — `req.accepts()`, `req.is()`, `res.format()`

```js
app.get('/greet', (req, res) => res.format({
  json: () => res.json({ hello: 'world' }),
  html: () => res.send('<h1>Hello</h1>'),
  default: () => res.status(406).send('Not Acceptable'),
}));
```

`parseAccept()` parses q-values and sorts by preference; `toMediaType()` maps
shorthands (`'json'`, `'html'`) to MIME types; `mediaTypeMatches()` handles
`*/*` and `type/*` ranges. `res.format()` sets `Vary: Accept` and falls back to
`406`.

### 4. Cookie parsing — `req.cookies`

The `Cookie` header is parsed once per request, including Express-style `j:`
JSON cookies, so `req.cookies.prefs` can be an object without extra middleware.
`res.cookie()` / `res.clearCookie()` handle serialization (`Path`, `Max-Age`,
`Expires`, `Domain`, `Secure`, `HttpOnly`, `SameSite`, `Partitioned`).

### 5. CORS — `cors(options)`

```js
app.use(cors({ origin: true, credentials: true, maxAge: 600 }));
```

Handles the awkward parts correctly: `origin` as string/array/`true`/function;
reflecting the origin when credentials are enabled (a literal `*` is illegal
with credentials); automatic `OPTIONS` preflight with
`Access-Control-Request-Headers` echo; `Vary: Origin`; `preflightContinue` to
let your routes own OPTIONS.

### 6. Response compression — `compress(options)`

```js
app.use(compress({ threshold: '1kb', filter: (req, res) => true }));
```

Wraps `res.send()`: picks `br` → `gzip` → `deflate` from `Accept-Encoding`,
skips already-encoded responses, non-compressible MIME types and bodies below
`threshold`, then compresses asynchronously with `node:zlib` and sets
`Content-Encoding` / `Vary: Accept-Encoding` / `Content-Length`. Streamed files
are deliberately left alone to preserve streaming.

### 7. Extra body parsers — `text()` and `raw()`

```js
app.use('/webhook', text());   // req.body is a string
app.use('/upload', raw());     // req.body is a Buffer
```

Same streaming reader, size limits and `413` semantics as `json()`.

### 8. `HEAD` → `GET` fallback, automatic `OPTIONS`, and `405`

Implemented inside `dispatch` (`methodAllows`, `recordAllowed`) plus
`_handleNotFound`. `HEAD` reuses `GET` handlers with the body suppressed; wrong
methods get `405 Method Not Allowed` with a correct `Allow` header; `OPTIONS` is
answered automatically with `204`.

### 9. `router.param()` and `router.route()`

```js
app.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return next(new HttpError(400, 'numeric id required'));
  next();
});

app.route('/items').get(list).post(create).delete(clear);
```

Param callbacks are looked up via `layer.owner.paramCallbacks` and run as the
first "steps" before the handler, so they can validate and short-circuit.

---

## API reference

```js
import {
  App, Router, createApp, HttpError, statusMessage,
  json, urlencoded, text, raw,
  logger, rateLimit, serveStatic, cors, compress,
  sendFile, lookupMime,
} from 'routiva';
```

### App

| Member | Description |
| --- | --- |
| `new App(options?)` | Create an app |
| `app.listen(port, [host], [cb])` | Create/start the `http.Server`, returns it |
| `app.close([cb])` | Stop the server |
| `app.get/post/put/patch/delete/head/options/all` | Route registration |
| `app.use([path], ...handlers)` | Middleware / mount a `Router` |
| `app.param(name, fn)` | Parameter callback |
| `app.route(path)` | Chainable method registration |
| `app.set/enable/disable/setting` | Settings |
| `app.handle(req, res, done)` | Dispatch an already-wrapped request |

### Request

`method`, `path`, `url`, `originalUrl`, `query`, `params`, `body`, `cookies`,
`headers`, `header(name)`/`get(name)`, `ip`, `ips`, `secure`, `protocol`,
`hostname`, `accepts(...types)`, `is(...types)`, `raw`.

### Response

`status(code)`, `set(name, value)`/`set(obj)`, `header`, `append(name, value)`,
`get(name)`, `vary(field)`, `type(value)`, `cookie(name, value, options)`,
`clearCookie(name, options)`, `redirect([status], url)`, `sendStatus(code)`,
`attachment(filename)`, `sendFile(path, options?, cb?)`,
`download(path, filename?, options?, cb?)`, `format(obj)`, `json(value)`,
`send(body)`, `write(chunk)`, `end(...)`, `raw`.

### Middleware factories

| Factory | Highlights |
| --- | --- |
| `json({ limit, strict, reviver, verify })` | Strict JSON, `400`/`413`, hooks |
| `urlencoded({ limit, extended })` | Bracket-notation nesting |
| `text({ limit, type, encoding })` | String body |
| `raw({ limit, type })` | Buffer body |
| `logger({ stream, format, enabled, color })` | One line per request |
| `rateLimit({ windowMs, max, keyGenerator, handler, skip, headers, store })` | `429` + `Retry-After` |
| `serveStatic(root, { maxAge, immutable, index, extensions, fallthrough, dotfiles, etag })` | Static files |
| `cors({ origin, methods, allowedHeaders, exposedHeaders, credentials, maxAge, preflightContinue })` | CORS |
| `compress({ threshold, level, filter })` | gzip/deflate/brotli |

Every factory is also attached to the class: `App.json()`, `App.serveStatic()`,
`App.rateLimit()`, …

---

## Advantages over Express

routiva is not trying to beat Express feature-for-feature. Its advantages are
concentrated in **transparency, dependency footprint, safety defaults and
batteries-included primitives**.

### 1. Zero dependencies (Express pulls a graph)

| | routiva | Express 4/5 |
| --- | --- | --- |
| Runtime dependencies | **0** | ~30 direct + transitive |
| `npm install` tree | framework only | `router`, `path-to-regexp`, `body-parser`, `cookie`, `serve-static`, `send`, `qs`, `debug`, `mime-types`, `etag`, `fresh`, … |
| Supply-chain surface | one repo | large transitive graph |
| Dev dependencies (tests) | **0** (`node:test`, `fetch`) | mocha/supertest/etc. |

A smaller tree means faster installs, smaller container images, easier audits and
fewer transitive security advisories to track.

### 2. Batteries included

Features that require extra Express packages ship in the core:

| Capability | routiva | Express |
| --- | --- | --- |
| Request logging | `logger()` built in | `morgan` |
| CORS | `cors()` built in | `cors` |
| Compression | `compress()` built in | `compression` |
| Rate limiting | `rateLimit()` built in | `express-rate-limit` |
| Static files | `serveStatic()` built in | `serve-static` |
| Body parsing | `json`/`urlencoded`/`text`/`raw` built in | `body-parser` (bundled in 4) |
| Cookies | `req.cookies` built in | `cookie-parser` |

### 3. Async errors handled uniformly

Express 4 only forwards **synchronous** throws to error middleware; a rejected
promise inside an `async` handler hangs or crashes unless you wrap it. routiva
attaches `.catch(next)` to every returned promise, so this just works:

```js
app.get('/data', async (req, res) => {
  const row = await db.get(req.params.id);   // rejection → your error middleware
  res.json(row);
});
```

### 4. Stricter, more correct HTTP defaults

- **`405 Method Not Allowed`** with a real `Allow` header when a path exists but
  the method doesn't (Express returns 404).
- **Automatic `OPTIONS`** responses (`204` + `Allow`).
- **`HEAD` reuses `GET`** with `Content-Length` preserved and body suppressed.
- **Duplicate-send protection** built into the response wrapper — a second
  `res.json()` is a no-op instead of an `ERR_HTTP_HEADERS_SENT` crash.
- **Built-in body parsers** for every common content type (JSON, form, text,
  raw) with size limits — no separate `body-parser` install.

### 5. Readable, greppable core

~1,900 lines across a flat module structure, no build step, no dynamic
`require`, no monkey-patching beyond wrapping the raw objects. `Request` and
`Response` are normal ES classes; `raw` is always one property away. This makes
the framework straightforward to audit, debug and fork.

### 6. Modern ESM-first API

Pure ESM (`"type": "module"`), named exports, and statics on `App`
(`App.rateLimit()`, `App.serveStatic()`), giving a single import surface for the
whole toolkit.

### At-a-glance comparison

| Dimension | routiva | Express |
| --- | --- | --- |
| Runtime deps | 0 | many |
| Routing (`:param`, `*`) | ✅ built in | ✅ via `path-to-regexp` |
| Mounted routers | ✅ prefix-stripped | ✅ |
| Async error propagation | ✅ automatic | ⚠️ Express 4 no, Express 5 yes |
| 405 + `Allow` | ✅ | ❌ (404) |
| Auto `OPTIONS` | ✅ | partial |
| `HEAD`→`GET` | ✅ | ✅ |
| Double-send guard | ✅ | ❌ |
| Template engines (`res.render`) | ❌ | ✅ |
| Sessions / flash | ❌ | via middleware |
| Ecosystem plugins | small | huge |
| TypeScript types | not bundled | `@types/express` |
| Streaming-safe compression | ❌ (buffered sends only) | ✅ |
| Maturity / battle-testing | new | years |

---

## Where Express still wins

Being honest about the tradeoffs is part of good architecture:

- **Ecosystem.** Express has thousands of mature middlewares and integrations.
- **Template rendering.** `res.render()` with any engine — routiva has no
  renderer.
- **Sessions, flash messages, auth strategies.** All external for routiva.
- **Advanced path syntax.** Express supports optional params, custom regex
  params and arrays of paths; routiva supports `:name` and `*`.
- **Streaming compression.** routiva buffers `res.send()` before compressing;
  Express's `compression` compresses streams.
- **Battle-testing.** Express has years of production hardening and a huge
  community; routiva is a compact, well-tested (~63 tests) implementation.

Use Express for large, long-lived apps that lean on the ecosystem. Use routiva
when you want a transparent, dependency-free core you can read end to end.

---

## Performance notes

The design favours predictable, allocation-light behaviour:

- **Paths compiled once.** `compile()` runs at registration; requests only run a
  cached `RegExp.test`-style `exec`.
- **O(1) `next()` cursor.** Dispatch uses a shared index and a `finished` latch,
  avoiding recursive re-scans.
- **Per-request work is linear in the number of layers** and happens once:
  URL/query/cookie parsing at wrap time, params during dispatch.
- **Streaming I/O** for request bodies (`readBuffer`) and file responses
  (`createReadStream`), so memory stays flat for large payloads/files.
- **In-memory rate limiting** with `unref()`'d cleanup timers that never keep
  the process alive.

No micro-benchmarks are claimed; measure against your own workload before
switching.

---

## Extending routiva

Any function `(req, res, next)` is middleware. To write one that talks to the
raw stream, use `.raw`:

```js
function timing() {
  return (req, res, next) => {
    const start = process.hrtime.bigint();
    res.set('X-Start', String(Date.now()));
    res.raw.on('finish', () => {
      res.set('X-Duration-Ms', String(Number(process.hrtime.bigint() - start) / 1e6));
    });
    next();
  };
}
app.use(timing());
```

A reusable module is just a factory returning middleware, following the pattern
in `src/middleware/`. A sub-application is a `Router` mounted with `use()`.

---

## Testing

```bash
npm test          # node --test
npm run test:watch
```

- **15 test files, 63 tests**, covering routing, params, queries, request/
  response APIs, middleware ordering, error propagation, body parsing, cookies,
  negotiation, static files, CORS, compression, rate limiting and logging.
- Real HTTP round-trips: the suite starts servers on ephemeral ports and uses
  `fetch` (plus a raw `http` helper where `fetch`'s auto-decompression would
  hide the truth, e.g. compression).
- No test framework dependency — `node:test` and `node:assert/strict`.

---

## Project structure

```
src/
  index.js                 Public entry point; App statics
  app.js                   App: server lifecycle, settings, 404/405/error
  router.js                Router: layers, path compile, dispatch, param/route
  request.js               Request wrapper
  response.js              Response wrapper + cookie serialization
  send.js                  File sending (MIME, ETag, Range)
  errors.js                HttpError + status text
  utils.js                 Query/cookie/accept parsing, bytes & durations
  middleware/
    body-parser.js         json() / urlencoded() / text() / raw()
    static.js              serveStatic()
    cors.js                cors()
    compress.js            compress()
    logger.js              logger()
    rate-limit.js          rateLimit() + MemoryStore
test/                      15 files, 63 tests
examples/
  basic.js                 Runnable demo (static, cors, compress, download, format)
  public/                  Assets for the demo
README.md  LICENSE  package.json
```

---

## Design principles

1. **Zero dependencies, always.** If a Node built-in can do it, use the built-in.
2. **One stack, ordered.** Registration order is execution order; no hidden
   phases.
3. **`next(err)` is the contract.** Sync throws and async rejections both flow
   to error middleware.
4. **Never crash on bad input.** Malformed URLs, JSON, cookies and ranges are
   handled; responses are write-once.
5. **Expose the raw layer.** `.raw` is always available, so the framework never
   becomes a cage.
6. **Small enough to read.** The whole framework fits in a handful of files with
   no build step.

---

## Roadmap

Ideas that would fit the architecture without breaking the zero-dependency rule:

- `res.render()` with a pluggable engine interface.
- A streaming-safe compression path (wrap the socket, not just `res.send`).
- Signed cookies and a lightweight `session()` store.
- Optional `app.mount()` with full sub-app semantics.
- Built-in TypeScript declarations.
- GitHub Actions CI and coverage reporting.

---

## License

MIT — see [LICENSE](./LICENSE).
