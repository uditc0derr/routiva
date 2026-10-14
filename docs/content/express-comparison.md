---
title: Coming from Express
description: Map an Express app onto routiva: what stays identical, what changes, and where Express still wins.
section: Guides
order: 4
---

## The mental model is unchanged

An app is a router. A router is an ordered list of layers. A layer is a route, a
piece of middleware, or an error handler. `next()` moves a request down the list,
and registration order is execution order. None of that changes when you move
from Express to routiva.

The handler signatures are identical, so most route bodies copy over untouched.
A function `(req, res, next)` is middleware in both. A four-arity function
`(err, req, res, next)` is an error handler in both.

## API mapping

| Express | routiva |
| --- | --- |
| `const app = express()` | `const app = createApp()` or `new App()` |
| `app.use(fn)` | `app.use(fn)` |
| `app.use('/api', router)` | `app.use('/api', router)` |
| `app.get/post/put/patch/delete/head/options` | identical, plus `app.all()` |
| `express.Router()` | `new Router()` |
| `express.json()` | `json()` or `App.json()` |
| `express.urlencoded({ extended: true })` | `urlencoded({ extended: true })` |
| `express.static('public')` | `serveStatic('public')` |
| `express.text()` / `express.raw()` | `text()` / `raw()` |
| `req.params`, `req.query`, `req.body`, `req.cookies` | identical |
| `req.get(name)` / `req.header(name)` | identical |
| `res.status/json/send/redirect/type/set/cookie` | identical |
| `res.sendFile(path)` / `res.download(path)` | identical |
| `req.accepts()` / `res.format()` | identical |
| `next(err)` | identical |
| `app.use((err, req, res, next) => {})` | identical |
| `app.listen(port, cb)` | identical; returns the `http.Server` |

The `cors`, `compression`, `express-rate-limit`, `morgan`, `cookie-parser` and
`serve-static` imports disappear. Their equivalents are exported by `routiva`
and used the same way.

## Same shape, less ceremony

A users endpoint in Express, with the packages it needs:

```js
import express from 'express';
import cors from 'cors';
import compression from 'compression';

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.find(req.params.id);
    if (!user) return res.status(404).json({ error: 'not found' });
    res.json(user);
  } catch (err) {
    next(err);          // Express 4 needs this
  }
});

app.listen(3000);
```

The routiva version:

```js
import { createApp, cors, compress, json } from 'routiva';

const app = createApp();
app.use(cors());
app.use(compress());
app.use(json());

app.get('/users/:id', async (req, res) => {
  const user = await db.find(req.params.id);   // a rejection is forwarded
  if (!user) return res.status(404).json({ error: 'not found' });
  res.json(user);
});

app.listen(3000);
```

The route body does not change. The `try/catch`, the extra imports and the
separate packages do.

## What differs

### Async errors are handled for you

Express 4 only forwards synchronous throws to error middleware. A rejected
promise inside an `async` handler hangs the request unless you wrap it. routiva
attaches `.catch(next)` to the value every handler returns, so `throw` and
`Promise.reject` both reach your error middleware. Express 5 catches async
errors too; routiva matches that behaviour.

### 405 with an Allow header

If a path matches but the method does not, routiva answers
`405 Method Not Allowed` with a correct `Allow` header. Express returns `404`.
For a path that exists, routiva answers `OPTIONS` automatically with `204` and
the same `Allow` list, and `HEAD` reuses the matching `GET` route with the body
suppressed.

### One response, once

`res.send()` and `res.json()` are guarded by `res.raw.headersSent` and
`res.raw.writableEnded`. A stray second `res.json()` is a no-op instead of an
`ERR_HTTP_HEADERS_SENT` crash.

### Body parse errors have stable types

`json()` rejects a body that is not an object or array with
`400 entity.parse.failed`, and an oversized body with `413 entity.too.large`.
The `type` value is set on the error, so one error handler can map both.

### No template engine or view system

There is no `res.render()`, no `app.set('view engine', ...)`, no views
directory, no view cache and no `app.locals`. If your app renders HTML on the
server, keep Express or render it yourself and call `res.send()`. One minor
detail: `res.locals` exists as an empty object on each response, but nothing in
the framework reads it for you.

### Smaller path syntax

routiva supports `:name` parameters and a `*` wildcard. Express also supports
optional parameters (`:id?`), inline regex (`:id(\d+)`) and arrays of paths.
Port those by validating inside `router.param()` or the handler.

## Where Express still wins

- **Ecosystem.** Thousands of mature middlewares, adapters and integrations.
- **Rendering.** Any template engine via `res.render()`.
- **Sessions, flash, auth.** Passport and its strategies are Express-shaped.
- **Advanced routing.** Optional params, regex params and path arrays.
- **Streaming compression.** routiva compresses buffered `res.send()` output;
  streamed files pass through untouched. Express's `compression` wraps the whole
  response stream.
- **Track record.** Express has years of production hardening. routiva is a
  compact, well-tested implementation.

Use Express when the ecosystem is doing real work for you. Use routiva when you
want the same mental model inside a core you can read end to end.

## A migration checklist

1. Replace `express()` with `createApp()` and swap `require` for an import.
2. Move CORS, compression and rate limiting to routiva's bundled factories.
3. Drop `cookie-parser`; `req.cookies` is already parsed.
4. Replace `express.json()` with `json({ limit: '100kb' })`.
5. Delete the `try/catch` plus `next(err)` wrappers around async handlers.
6. Replace `res.render()` call sites before you start.
7. Run your suite against the new app. Most handler bodies will not have
   changed.
