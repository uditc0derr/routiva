---
title: Routing
description: Define routes, capture :params and * wildcards, mount sub-routers, and understand exactly how a path is matched.
section: Core concepts
order: 2
---

## The route methods

Every HTTP method has a matching method on the app (and on a `Router`):

```js
import { createApp } from 'routiva';

const app = createApp();

app.get('/users', (req, res) => res.json([]));
app.post('/users', (req, res) => res.status(201).json(req.body));
app.put('/users/:id', replaceUser);
app.patch('/users/:id', patchUser);
app.delete('/users/:id', deleteUser);
app.head('/users/:id', headUser);
app.options('/users/:id', optionsUser);
app.all('/ping', (req, res) => res.send('pong'));
```

| Method | Registers |
| --- | --- |
| `get` `post` `put` `patch` `delete` `head` `options` | A route for that one method |
| `all` | A route for **every** method (stored with a `null` method) |
| `use` | Middleware (see [Middleware](middleware.md)) |

A route only runs when both the path and the method match. `HEAD` is special:
it is served by a matching `GET` route, with the body suppressed. See
[HEAD, OPTIONS and 405](#head-options-and-405).

## More than one handler per route

Any number of handlers can be registered for one path. Each becomes its own
layer sharing the same compiled pattern, so they run in order:

```js
app.get('/reports/:id', requireAuth, loadReport, (req, res) => {
  res.json(req.report);
});
```

`requireAuth` runs first, calls `next()` to continue, then `loadReport`, then the
final handler. Arrays are flattened, so `app.get('/x', [a, b], c)` works too.
This is the same trick Express uses for route-level middleware.

## Path parameters

A `:name` segment captures one path segment (everything up to the next `/`):

```js
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});
```

| Pattern | Request | Match? | `req.params` |
| --- | --- | --- | --- |
| `/users/:id` | `/users/42` | ✅ | `{ id: '42' }` |
| `/users/:id` | `/users/42/` | ✅ | `{ id: '42' }` (trailing slash tolerated) |
| `/users/:id` | `/users/42/posts` | ❌ | — |
| `/users/:id` | `/users/a%20b` | ✅ | `{ id: 'a b' }` (decoded) |
| `/users/:id/posts/:postId` | `/users/7/posts/9` | ✅ | `{ id: '7', postId: '9' }` |

Captured values are URL-decoded with a safe wrapper, so a malformed escape such
as `%E0%A4` is left as-is instead of throwing a `500`.

Params from an outer layer and an inner layer are **merged**, with the inner
value winning. When a mounted router matches `:tenant` and a route inside it
matches `:id`, the handler sees both.

```text
app.use('/t/:tenant', router)      // captures { tenant }
  router.get('/u/:id', handler)    // captures { id }
                                   // handler sees { tenant, id }
```

routiva supports **required** `:name` segments only. Optional (`:id?`), inline
regex (`:id(\\d+)`) and arrays of paths are not part of the syntax — validate
inside a [`param()` callback](#routerparam) or the handler instead.

## Wildcards

`*` captures the rest of the path (including slashes) under the key `wildcard`:

```js
app.get('/files/*', (req, res) => {
  res.json({ path: req.params.wildcard });
});
```

| Pattern | Request | `req.params.wildcard` |
| --- | --- | --- |
| `/files/*` | `/files/a/b/c.txt` | `'a/b/c.txt'` |
| `/files/*` | `/files/` | `''` |
| `*` | `/anything/at/all` | `'anything/at/all'` |

A bare `*` route is the usual single-page-app or catch-all fallback, and is
matched with the lowest priority because it is registered last:

```js
app.get('*', (req, res) => res.sendFile('dist/index.html'));
```

## How a path is compiled

Patterns are compiled to a `RegExp` **once, at registration**, and reused for
every request. `compile(pattern, end)` in `src/router.js` normalises the leading
and trailing slashes, splits on `:name` and `*`, regex-escapes the literals,
and turns `:name` into `([^/]+)` and `*` into `(.*)`.

```
/users/:id     end → /^\/users\/([^/]+)\/?$/     exact
/files/*       end → /^\/files\/(.*)\/?$/        exact
/api  (mount)  end → /^\/api(?=\/|$)/            prefix
/              end → /^\/?$/    prefix → /^/
```

Two details matter:

- **Routes use an exact match** that tolerates a trailing slash (`^…/?$`).
- **Mounted middleware uses a prefix match** with a lookahead (`^…(?=/|$)`), so
  `/api` matches `/api` and `/api/users` but not `/apis`.

Matching is **case-sensitive**: `/Users` and `/users` are different paths.

The captured names are stored in a `keys` array alongside the regex, and zipped
back onto the match at request time, so parameter order is preserved.

## Mounted routers

A `Router` is a self-contained stack you can mount on a path:

```js
import { App, Router } from 'routiva';

const api = new Router();
api.get('/status', (req, res) => res.json({ status: 'ok' }));

const app = new App();
app.use('/api', api);
```

`app.use('/api', api)` mounts the router at the `/api` prefix. When a request
reaches it, the prefix is **stripped** before the inner router runs, so the
router above sees `/status`, not `/api/status` — exactly like an Express sub-app.
The original `req.path`, `req.url`, `req.params` and `req.route` are saved and
**restored** the moment the mounted layer calls `next()`, so an outer route can
continue where the inner router left off.

Routers nest: mount a router inside a router, and each prefix is stripped and
restored in turn.

```js
const admin = new Router();
admin.get('/users', (req, res) => res.json({ scope: 'admin' }));

const v1 = new Router();
v1.use('/admin', admin);          // /v1/admin/users

app.use('/v1', v1);
```

## router.route()

Register several methods for one path with a chainable builder:

```js
app.route('/items')
  .get(listItems)
  .post(createItem)
  .delete(clearItems);
```

The chain exposes `get`, `post`, `put`, `patch`, `delete`, `head`, `options` and
`all`, and every call returns the chain so calls can be stacked.

## router.param()

`param(name, fn)` registers a callback that runs whenever `name` appears in a
**matched route's** parameters, before that route's handlers:

```js
import { HttpError } from 'routiva';

app.param('id', (req, res, next, id, name) => {
  if (!/^\d+$/.test(id)) {
    return next(new HttpError(400, `${name} must be numeric`));
  }
  req.userId = Number(id);
  next();
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.userId });   // already validated and coerced
});
```

| Argument | Meaning |
| --- | --- |
| `req`, `res` | The wrapped request and response |
| `next` | Continue to the route handler, or `next(err)` to fail |
| `value` | The decoded parameter value |
| `name` | The parameter name |

Callbacks are looked up on the router that **registered** the route, so a
mounted router's params use its own callbacks. They run in parameter-name order,
and a `next(err)` from any of them short-circuits straight to the error chain.

## HEAD, OPTIONS and 405

routiva handles the request-method corners of HTTP for you:

- **`HEAD`** is served by a matching `GET` route. Headers (including
  `Content-Length`) are computed as usual; the body is suppressed.
- **`OPTIONS`** on a known path is answered automatically with `204` and an
  `Allow` header listing the allowed methods.
- A path that matches but a method that does not produces
  **`405 Method Not Allowed`** with the same `Allow` header — not a `404`.

The allowed list is recorded while the stack is scanned. When a `GET` route
exists, `HEAD` is recorded with it, so a `GET`-only path reports
`Allow: GET, HEAD, OPTIONS`.

```http
OPTIONS /users HTTP/1.1

HTTP/1.1 204 No Content
Allow: GET, HEAD, OPTIONS, POST
```

If you want to answer `OPTIONS` yourself, register a route for it; it matches
before the built-in fallback. CORS middleware answers its own preflights too,
which takes precedence — see [CORS](cors.md).

## Registration order is execution order

Routes and middleware share one ordered stack, so the first matching layer that
responds wins. Register specific routes before catch-alls, and API routes before
a static or SPA fallback:

```js
app.get('/api/users', listUsers);              // matched first
app.use(serveStatic('public', { extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile('dist/index.html'));  // last resort
```

## A complete router

```js
import { App, Router, HttpError } from 'routiva';

const app = new App();

// Validate and coerce :id once for every route that uses it.
app.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return next(new HttpError(400, 'id must be numeric'));
  req.itemId = Number(id);
  next();
});

app.route('/items')
  .get((req, res) => res.json([]))
  .post((req, res) => res.status(201).json(req.body));

app.get('/items/:id', (req, res) => {
  res.json({ id: req.itemId });
});

app.get('/files/*', (req, res) => {
  res.json({ file: req.params.wildcard });
});

// Mounted sub-router, prefix stripped to "/v1"
const v1 = new Router();
v1.get('/ping', (req, res) => res.json({ pong: true }));
app.use('/v1', v1);

app.listen(3000);
```

## Where to go next

| If you want to… | Read |
| --- | --- |
| Write your own middleware | [Middleware](middleware.md) |
| Use `req` and `res` in full | [Request & Response](request-response.md) |
| Route errors to handlers | [Error handling](error-handling.md) |
| Serve files and SPA fallbacks | [Static files](static-files.md) |
