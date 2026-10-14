---
title: Architecture
description: How routiva works under the hood — the layer stack, path compilation, dispatch and restoration, body parsing and file sending.
section: Reference
order: 2
---

## High-level map

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

The request enters at `_handle`, is wrapped, then flows through a single ordered
list of layers. Each layer either handles the request, passes control onward
with `next()`, or raises an error with `next(err)`. When the stack is exhausted,
`done(err)` chooses between an error response and a 404/405/OPTIONS.

## Module dependency graph

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
(`res.sendFile()` and `serveStatic()`).

## Module reference

| Module | Responsibility |
| --- | --- |
| `src/index.js` | Public entry point; attaches middleware factories as `App` statics |
| `src/app.js` | `App`: server lifecycle, settings, default 404/405/error handling |
| `src/router.js` | `Router`: layer stack, path compilation, dispatch, `param`/`route`/`use` |
| `src/request.js` | `Request` wrapper: URL, query, cookies, IP, negotiation |
| `src/response.js` | `Response` wrapper: chainable helpers, cookies, send, sendFile, format |
| `src/send.js` | File sending: MIME lookup, ETag, `Last-Modified`, Range, streaming |
| `src/errors.js` | `HttpError` + HTTP reason phrases |
| `src/utils.js` | Query/cookie/accept parsing, byte & duration parsing, regex escaping |
| `src/middleware/body-parser.js` | `json()`, `urlencoded()`, `text()`, `raw()` |
| `src/middleware/static.js` | `serveStatic()` with traversal protection and fallthrough |
| `src/middleware/cors.js` | `cors()` with preflight handling |
| `src/middleware/compress.js` | `compress()` via gzip / deflate / brotli |
| `src/middleware/logger.js` | `logger()` request logging |
| `src/middleware/rate-limit.js` | `rateLimit()` + `MemoryStore` fixed windows |

## The layer stack

`Router` holds a single array, `this.stack`. Registering anything pushes one
layer **per handler function**:

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
execution order**. A route registered with several handlers pushes several
layers that share one compiled `regex` and `keys` array.

## Path matching

Patterns are compiled to a `RegExp` once, at registration time:

```
/                     end → /^\/?$/              prefix → /^/
/users/:id            end → /^\/users\/([^/]+)\/?$/
/files/*              end → /^\/files\/(.*)\/?$/
/users                prefix → /^\/users(?=\/|$)/
```

1. Normalise leading/trailing slashes.
2. Split on `:name` and `*` tokens, keeping the literals.
3. Regex-escape the literals; `:name` → `([^/]+)`, `*` → `(.*)`.
4. `end: true` anchors with `^…\/?$` — an **exact** match for routes, tolerating
   a trailing slash.
5. `end: false` uses a lookahead `^…(?=\/|$)` — a **prefix** match for mounted
   middleware, without consuming the next `/`.

The `keys` array records parameter names in capture order, so `invoke()` can zip
`match[1..n]` back onto names:

```js
layer.keys.forEach((key, i) => {
  const value = match[i + 1];
  if (value !== undefined) params[key] = safeDecode(value);   // URL-decode captures
});
```

`safeDecode` wraps `decodeURIComponent`, so a malformed `%` never throws a 500.

## Dispatch and `next()`

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

      if (!methodAllows(layer, req)) {                     // HEAD→GET fallback
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

A `while` loop keeps stack depth O(1) per `next()` call and guarantees the cursor
never moves backwards. `finished` ensures `done` runs exactly once even if a
handler calls `next()` repeatedly.

`methodAllows` lets a `HEAD` request use a `GET` route. When a path matches but
the method does not, `recordAllowed` notes the method (and `HEAD` for `GET`) so
`_handleNotFound` can build the `Allow` header.

## Params, mount prefixes and restoration

`invoke()` runs a layer and does four careful things:

**1. Build and merge params** — child params shadow parent params.

**2. Strip the mount prefix** for middleware, so a router mounted at `/api`
sees `/hello`, not `/api/hello`.

**3. Restore on `next()`** — the previous `params`/`path`/`url`/`route` are saved
and restored the first time the layer calls `next()`. A `nextCalled` latch
ignores duplicate calls:

```js
// src/router.js — invoke() (abridged)
const previous = { params: req.params, path: req.path, url: req.url, route: req.route };
req.params = { ...previous.params, ...params };
req.route = layer;

const consumed = layer.isMiddleware ? match[0].length : 0;   // prefix length
if (consumed > 0) { /* req.path = req.path.slice(consumed) … */ }

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

`runSteps` sequences each param callback and the handler, so a callback can
validate and short-circuit with `next(err)` before the handler runs. This is why
both `throw` and `Promise.reject` reach error middleware.

## Error handling by arity

Error handlers are ordinary functions whose `length === 4`:

```js
app.use((err, req, res, next) => { /* ... */ });
```

The dispatch loop selects layers with `layer.isErrorHandler !== wantsError`, so
4-arity functions are skipped during normal flow and 3-arity functions are
skipped during error flow. No registration API is involved.

If no error handler responds, `App._handleError` runs:

```js
// src/app.js — _handleError() (abridged)
const status = normalizeStatus(error);          // err.status/statusCode, else 500
if (res.raw.headersSent) { res.raw.destroy?.(); return; }   // cannot recover

const expose = this.setting('expose stack');
const message = error.expose || expose ? error.message : statusMessage(status);
res.status(status).json({ error: { message, status, type: error.type } });
```

`HttpError` sets `expose = status < 500`, so 4xx messages reach clients while 5xx
messages are hidden in production (a stack is included only when `expose stack`
is on and the status is `>= 500`).

## The Request wrapper

`Request` lifts the fiddly parts of `IncomingMessage` into plain fields, parsed
once in the constructor so later reads are cheap:

```js
const parsed = new URL(raw.url, 'http://localhost');  // base is irrelevant
this.path = parsed.pathname;                          // path only
this.search = parsed.search;
this.query = parseQuery(parsed.searchParams);         // repeated keys → arrays
this.cookies = parseCookies(this.headers.cookie);     // j: JSON decoded
this.ip = this._resolveIp();                          // honours trust proxy
```

`parseQuery` collapses `?tag=a&tag=b` into `{ tag: ['a', 'b'] }`. `req.accepts()`
and `req.is()` use the shared negotiation helpers in `utils.js`, and the full
field list is on the [Request & Response](request-response.md) page.

## The Response wrapper

`Response` wraps `ServerResponse` and makes every mutator return `this`. The
important safety mechanic is the **double-send guard**:

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
`ERR_HTTP_HEADERS_SENT`. `_writeBody()` suppresses the payload for `HEAD`
requests while still computing `Content-Length`, so `HEAD` reuses `GET` routes.

## Body parsing pipeline

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

- On overflow the stream is **drained** (`resume()`) rather than destroyed, so
  the `413` response can actually be delivered.
- `json()` adds a **strict** check (must start with `{` or `[`) and wraps parse
  failures in a `400` with `type: 'entity.parse.failed'`.
- Content-type gating means each parser ignores bodies it does not own, so they
  can be stacked; `raw()` accepts anything when no `type` is given.
- `verify` runs on the raw `Buffer` before `JSON.parse`, so a throwing signature
  check flows into your error middleware.

See [Body parsing](body-parsing.md) for the option tables.

## File sending

`src/send.js` is shared by `res.sendFile()` and `serveStatic()`. It implements
conditional-request and range semantics:

```
stat file ──▶ set Last-Modified, Accept-Ranges, ETag (W/"size-mtime")
              │
              ├─ If-None-Match / If-Modified-Since fresh? ─▶ 304
              ├─ Range: bytes=a-b ─▶ 206 + Content-Range, stream that slice
              ├─ bad range ─▶ 416 + Content-Range: bytes */size
              ├─ maxAge ─▶ Cache-Control: public, max-age=…[, immutable]
              └─ else ─▶ 200 + Content-Length, stream the file
```

`pipeFile()` uses `createReadStream(path, range).pipe(res.raw)` and resolves on
`finish`, so memory stays flat for any file size. `serveStatic()` layers on
traversal protection (`resolveWithin`), a dotfiles policy, index files,
extension fallback and safe fallthrough. See [Static files](static-files.md).

## Settings and environment

`App` keeps a null-prototype `settings` object:

| Setting | Default | Effect |
| --- | --- | --- |
| `env` | `NODE_ENV` / `development` | Environment name |
| `trust proxy` | `false` | `req.ip`/`req.ips` use `X-Forwarded-For` |
| `x-powered-by` | `false` | Emit `X-Powered-By: routiva` |
| `expose stack` | non-production | 5xx messages + stacks in responses |
| `json spaces` | `0` | Reserved |

Set them via `app.set(key, value)`, `app.enable(key)`, `app.disable(key)`; read
with `app.setting(key)`. `Request` consults `app.setting('trust proxy')` to
resolve the client IP.

## 404 / 405 / OPTIONS

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

This is stricter than Express (which generally returns `404` for a wrong method)
and correct per RFC 9110.

## Exit points

The framework never writes a response it cannot finish:

- Handlers that respond end the request; further writes are no-ops.
- Handlers that pass with `next()` reach the next matching layer.
- Handlers that fail with `next(err)` reach the error chain.
- An exhausted stack reaches `_handleNotFound`.
- An unhandled error reaches `_handleError`, or aborts the socket if headers were
  already sent.

## Where to go next

| If you want to… | Read |
| --- | --- |
| Match a name to a method | [API reference](api-reference.md) |
| See the layer stack in use | [Middleware](middleware.md) |
| Understand the tradeoffs | [Coming from Express](express-comparison.md) |
