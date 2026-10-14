---
title: Error handling
description: Route errors into 4-argument middleware, throw HttpError, and understand the default JSON error and 404/405 responses.
section: Core concepts
order: 7
---

## next(err) is the switch

Handlers either finish the response or call `next()`. Calling `next(err)` with a
truthy value switches the stack into error mode: from that point, only
4-argument error handlers are eligible.

```js
app.get('/users/:id', (req, res, next) => {
  const user = users.get(req.params.id);
  if (!user) return next(new HttpError(404, 'user not found'));
  res.json(user);
});
```

Two things reach error middleware automatically, with no wrapper library:

- A **synchronous `throw`** inside any handler.
- A **rejected promise** returned by any handler. The router calls
  `.catch(next)` on every returned promise.

```js
app.get('/data', async (req, res) => {
  const row = await db.get(req.params.id); // rejection → error middleware
  res.json(row);
});
```

Express 4 only forwarded synchronous throws; routiva forwards both.

## Error middleware

An error handler is any function whose `length === 4`. There is no registration
API — arity is the marker.

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: { message: err.message } });
});
```

The dispatch loop skips 4-arity functions during normal flow and skips 3-arity
functions during error flow, so the same stack serves both.

Ordering matters, exactly as with regular middleware:

- Register error handlers **after** the routes whose errors they should catch.
- Registering one **before** a route means that route's errors will not reach it,
  because the cursor has already moved past it.

Inside an error handler you can:

- Send a response, ending the chain.
- Call `next(err)` to pass the error to the next error handler (for example WARN,
  then a final JSON handler).
- Call `next()` with no argument to drop back into normal flow at the current
  cursor.
- Call `next` after the response is sent — the response is write-once, so extra
  calls are ignored.

## HttpError

`HttpError` carries an HTTP status and marks itself safe to expose:

```js
import { HttpError } from 'routiva';

throw new HttpError(422, 'validation failed', { type: 'validation.failed' });
```

| Argument | Type | Notes |
| --- | --- | --- |
| `status` | `number` | Also assigned to `statusCode` |
| `message` | `string` | Defaults to the status reason phrase |
| `options.expose` | `boolean` | Overrides the default exposure of the message |
| `options.type` | `string` | Machine-readable error code, echoed in the response |
| `options.cause` | `Error` | Underlying error, kept off the wire |

`error.expose` is set to `status < 500 || options.expose === true`. In other
words, 4xx messages are safe to send and 5xx messages are hidden unless you opt
in. The constructor also preserves a `cause` and sets the error name to
`HttpError`.

Convenience constructors:

| Call | Status |
| --- | --- |
| `HttpError.badRequest(message?, options?)` | `400` |
| `HttpError.unauthorized(message?, options?)` | `401` |
| `HttpError.forbidden(message?, options?)` | `403` |
| `HttpError.notFound(message?, options?)` | `404` |
| `HttpError.methodNotAllowed(message?, options?)` | `405` |
| `HttpError.tooLarge(message?, options?)` | `413` |
| `HttpError.internal(message?, options?)` | `500` |

## The default error handler

If no error middleware sends a response, `App._handleError` runs. It normalises
the error first: it accepts anything (`next('oops')` becomes `new Error('oops')`),
reads `err.status` or `err.statusCode`, and uses it only when it is an integer
between `400` and `599`. Everything else becomes `500`.

The body is JSON:

```json
{
  "error": {
    "message": "user not found",
    "status": 404,
    "type": "validation.failed"
  }
}
```

- `type` is included only when `error.type` is set.
- `stack` is included only when the `expose stack` setting is on **and** the
  status is `>= 500` and a stack exists.
- `message` is `error.message` when the error is exposed **or** `expose stack` is
  on; otherwise it is the canonical reason phrase for the status.

### expose stack and production

The `expose stack` setting defaults to `env !== 'production'`, where `env` comes
from `options.env`, then `NODE_ENV`, then `'development'`. So in development the
real message and a 5xx stack are returned; with `NODE_ENV=production` a 500
returns `{ "error": { "message": "Internal Server Error", "status": 500 } }` with
no stack.

| Error | `expose` | Development | Production |
| --- | --- | --- | --- |
| `HttpError(404, 'user not found')` | `true` | `user not found` | `user not found` |
| `HttpError(500, 'db down')` | `false` | `db down` + stack | `Internal Server Error` |
| `new Error('boom')` | unset | `boom` + stack | `Internal Server Error` |

Set it explicitly with `app.set('expose stack', true/false)` or the
`exposeStack` constructor option. For a single error, set
`options.expose: true` on the `HttpError`.

### Headers already sent

If a handler throws after it has started writing, the response cannot be replaced.
The default handler checks `res.raw.headersSent` and, rather than crashing with
`ERR_HTTP_HEADERS_SENT`, aborts the socket with `res.raw.destroy()`. Your own
error middleware should make the same check:

```js
app.use((err, req, res, next) => {
  if (res.raw.headersSent) return next(err); // let the default handler abort
  res.status(500).json({ error: { message: 'Internal Server Error', status: 500 } });
});
```

## 404, 405 and OPTIONS

When the stack is exhausted without an error, `_handleNotFound` runs. If any
route matched the path but not the method, that method is recorded and the
response describes what is allowed.

| Situation | Response |
| --- | --- |
| No path matched | `404` + `{ error: { message: 'Not Found', status: 404, path: req.originalUrl } }` |
| Path matched, wrong method | `405` + `Allow` header + `{ error: { message: 'Method Not Allowed', status: 405 } }` |
| `OPTIONS` on a known path | `204` + `Allow` header, empty body |

The `Allow` list is sorted and always includes `OPTIONS`. When a `GET` route
exists, `HEAD` is recorded alongside it, so a `GET`-only path reports
`Allow: GET, HEAD, OPTIONS`. This is stricter than Express, which returns `404`
for a wrong method, and matches RFC 9110.

## Customising

Add your own error middleware after the routes. A typical handler logs, then
renders a stable shape:

```js
import { App, HttpError } from 'routiva';

const app = new App();

app.get('/users/:id', (req, res) => {
  throw new HttpError(404, 'user not found', { type: 'user.not_found' });
});

app.use((err, req, res, next) => {
  if (res.raw.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: {
      message: status < 500 ? err.message : 'internal error',
      status,
      type: err.type,
    },
  });
});

app.use((err, req, res, next) => {
  // Fallback: delegate anything unhandled to the built-in handler.
  next(err);
});
```

To replace the default 404 itself, register a terminal middleware or catch-all
route after your real routes; it will run before `_handleNotFound` gets a chance:

```js
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not Found', status: 404, path: req.originalUrl } });
});
```
