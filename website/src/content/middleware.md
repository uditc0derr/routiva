---
title: Middleware
description: What a middleware function is, how ordering works, how to mount routers and paths, and how to write your own.
section: Core concepts
order: 3
---

## What middleware is

Middleware is a function with three parameters:

```js
function middleware(req, res, next) {
  // read the request, set headers, maybe respond …
  next(); // … then pass control down the stack
}
```

A middleware either **ends the request** by sending a response, or **passes it
on** with `next()`. It can also **fail** the request with `next(err)`, which
switches the stack into error mode. Anything registered with `app.use()` is
middleware; a route handler is just middleware that also has to match a method.

## Registering middleware

```js
import { createApp, logger, cors, json } from 'routiva';

const app = createApp();

app.use(logger());       // every request
app.use(cors());
app.use(json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
```

`app.use(fn)` runs on every request that reaches it, regardless of path.
Passing an array works too: `app.use([logger(), cors()])`.

## Mounting under a path

Give `use()` a path to run the middleware only for that prefix:

```js
app.use('/api', requireApiKey);   // /api, /api/users, /api/users/42, …
app.use('/admin', adminOnly);     // not /adminx
```

The prefix match uses a lookahead, so `/api` matches `/api` and `/api/users`
but not `/apis`. When the middleware runs, the mount prefix is **stripped** from
`req.path` and `req.url`, and everything is **restored** on `next()` — the same
mechanism mounted routers use (see [Routing](routing.md#mounted-routers)).

```js
app.use('/api', (req, res, next) => {
  console.log(req.path);   // "/users" for a request to /api/users
  next();                  // after this, req.path is "/api/users" again
});
```

A path can be given without handlers only if you pass at least one function;
`app.use('/api')` with no handler throws a `TypeError`.

## Ordering

There is **one stack**, and **registration order is execution order**. This is
the whole mental model:

```js
app.use(logger());                 // 1
app.use(json());                   // 2
app.get('/users', listUsers);      // 3  ← responds
app.use((err, req, res, next) => { // 4  ← only on next(err)
  res.status(500).json({ error: { message: err.message } });
});
```

Consequences worth internalising:

- Middleware registered **after** a route cannot run before it.
- A route that calls `next()` lets the request fall through to layers registered
  below it, including a static handler or a catch-all.
- An error handler placed **before** a route cannot catch that route's errors,
  because the cursor has already moved past it.

## Passing control on

`next()` moves to the next matching layer. It is safe to call from nested
callbacks and after an `await`:

```js
app.use(async (req, res, next) => {
  const user = await loadUser(req);
  req.user = user;
  next();
});
```

Two rules keep the stack sane:

- Call `next()` **once**. A `nextCalled` latch on each layer ignores duplicates.
- Do not call `next()` **and** send a response. If a layer responds, the request
  is finished; a later `next()` simply has nothing to do.

Errors are the exception you *want* to forward:

```js
app.use((req, res, next) => {
  try {
    risky();
    next();
  } catch (err) {
    next(err);        // jump to the error chain
  }
});
```

Throwing synchronously does the same thing, as does rejecting from an `async`
middleware. routiva attaches `.catch(next)` to every returned promise, so this
works without a wrapper:

```js
app.use(async (req, res, next) => {
  await mightFail();   // a rejection becomes next(err) automatically
  next();
});
```

## Error middleware

A function with **four** parameters is an error handler. Arity is the only
marker — there is no separate registration API:

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: { message: err.message } });
});
```

During normal flow, four-arity functions are skipped; during error flow,
three-arity functions are skipped. Register error handlers **last**. The full
story — `HttpError`, `expose stack`, the default handler and 404/405 — is on the
[Error handling](error-handling.md) page.

## Mounting a Router

A `Router` is middleware too. `app.use('/prefix', router)` mounts a whole
sub-stack:

```js
import { App, Router } from 'routiva';

const users = new Router();
users.get('/', (req, res) => res.json([]));
users.get('/:id', (req, res) => res.json({ id: req.params.id }));

const app = new App();
app.use('/users', users);
```

Because routers are just middleware, they compose: mount one router inside
another, or mix router methods with `use()` on the same prefix.

## Writing your own

A reusable middleware is a factory that returns the function. Keep the setup in
the factory and the per-request work in the returned closure:

```js
export function timing() {
  return function timingMiddleware(req, res, next) {
    const start = process.hrtime.bigint();
    res.raw.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      res.set('X-Duration-Ms', ms.toFixed(1));   // no effect once sent
      console.log(`${req.method} ${req.url} ${res.statusCode} ${ms.toFixed(1)}ms`);
    });
    next();
  };
}
```

A few practical notes:

- The factory pattern (`timing()` returns a function) lets callers pass options
  and keeps the built-in middleware consistent. Every built-in follows it.
- `req.raw` and `res.raw` expose the underlying `IncomingMessage` and
  `ServerResponse` for anything the wrappers do not cover.
- Setting a header after the response has started does nothing — do header work
  before you call `next()`.

### Attaching data to the request

A common pattern is to look something up once and stash it on `req` for later
layers:

```js
app.use('/api', async (req, res, next) => {
  req.db = await pool.connect();
  next();
});

app.get('/api/users', (req, res) => {
  res.json(rowsFrom(req.db));
});
```

### A conditional guard

```js
app.use('/admin', (req, res, next) => {
  if (req.header('authorization') !== `Bearer ${SECRET}`) {
    return next(new HttpError(401, 'unauthorized'));
  }
  next();
});
```

## The built-in middleware

routiva ships the pieces most apps need. Each is documented on its own page:

| Factory | Page |
| --- | --- |
| `json` `urlencoded` `text` `raw` | [Body parsing](body-parsing.md) |
| `serveStatic` | [Static files](static-files.md) |
| `cors` | [CORS](cors.md) |
| `compress` | [Compression](compression.md) |
| `rateLimit` | [Rate limiting](rate-limiting.md) |
| `logger` | [Logging](logging.md) |

Every factory is also attached to the `App` class (`App.json()`,
`App.cors()`, …), so both import styles work.

## A recommended order

```js
const app = createApp();

app.use(logger());          // observe everything
app.use(cors());            // answer preflights early
app.use(compress());        // wrap res.send before bodies are built
app.use(rateLimit());       // reject before doing real work
app.use(json());            // parse bodies
app.use(serveStatic('public'));

app.get('/api/users', listUsers);
app.use('/api', apiRouter);
app.get('*', (req, res) => res.sendFile('public/index.html'));

app.use(errorHandler);      // 4-arity, always last
```

## Where to go next

| If you want to… | Read |
| --- | --- |
| Understand path matching | [Routing](routing.md) |
| Handle thrown and rejected errors | [Error handling](error-handling.md) |
| Use the built-in middleware | [CORS](cors.md), [Compression](compression.md), [Rate limiting](rate-limiting.md) |
