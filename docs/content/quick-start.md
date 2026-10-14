---
title: Quick start
description: Build a small routiva app step by step, then exercise every endpoint with curl.
section: Introduction
order: 3
---

## What we are building

One file with a JSON API, request logging, body parsing, a static `public/`
folder and error handling. Each step adds one piece and explains why. The
finished server is about 40 lines.

## 1. Scaffold the project

```bash
mkdir routiva-app
cd routiva-app
npm init -y
npm pkg set type=module
npm install routiva
```

`npm pkg set type=module` writes `"type": "module"` into `package.json`, which
is required — routiva is ESM-only.

## 2. Your first route

Create `server.js`:

```js
import { createApp } from 'routiva';

const app = createApp();

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

Run `node server.js` and open <http://localhost:3000/>. `res.json()` sets
`Content-Type: application/json` and serializes the object.

## 3. Add logging and JSON parsing

`logger()` prints one line per request; `json()` parses JSON bodies into
`req.body`. Register both before your routes:

```js
import { createApp, logger, json } from 'routiva';

const app = createApp();

app.use(logger());
app.use(json());
```

Both call `next()`, so the request continues to the routes below. Middleware
registered after a route cannot run before it — registration order is
execution order.

## 4. Add a parameterized route

```js
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});
```

`:id` matches a single path segment. `/users/42` sets `req.params.id` to the
string `'42'`; `/users/42/posts` does not match.

## 5. Read the query string

```js
app.get('/search', (req, res) => {
  res.json({ q: req.query.q, tags: req.query.tag });
});
```

`req.query` is parsed from the URL. Repeated keys become arrays, so
`?tag=a&tag=b` yields `{ tag: ['a', 'b'] }`.

## 6. Accept a JSON body

```js
app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});
```

`req.body` is populated by `json()` for `application/json` requests. Bodies
over the 1mb default limit get a `413`; malformed JSON gets a `400`.

## 7. Throw an error

Handlers can throw, and `async` handlers can reject. Either way the error flows
to an error handler. routiva has a default one, but a custom handler is easy to
add — four parameters marks it, and it is registered last:

```js
import { HttpError } from 'routiva';

app.get('/boom', async () => {
  throw new HttpError(503, 'service unavailable');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});
```

Without the custom handler, routiva returns
`{ "error": { "message": "...", "status": ... } }` for an `HttpError` and a
generic `500` for anything else.

## 8. Serve a folder of static files

Create `public/index.html`:

```html
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>routiva</title></head><body><h1>Served by routiva</h1></body></html>
```

Register the middleware after your routes so an explicit route always wins:

```js
import { serveStatic } from 'routiva';

app.use(serveStatic('public'));
```

`serveStatic` streams files, sets `ETag`/`Last-Modified` for `304` responses,
honours single `Range` requests, and falls through to the next layer when a file
is missing.

## 9. The complete server

```js
import { createApp, logger, json, serveStatic, HttpError } from 'routiva';

const app = createApp();

// middleware every request passes through
app.use(logger());
app.use(json());

// routes
app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.get('/search', (req, res) => {
  res.json({ q: req.query.q, tags: req.query.tag });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.get('/boom', async () => {
  throw new HttpError(503, 'service unavailable');
});

// static files fall back for anything the routes did not match
app.use(serveStatic('public'));

// error handler goes last
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

## 10. Run it and test every endpoint

Start it with `node server.js`, then run:

```bash
curl http://localhost:3000/
curl http://localhost:3000/users/42
curl "http://localhost:3000/search?q=cats&tag=a&tag=b"
curl -i -X POST http://localhost:3000/users \
  -H 'content-type: application/json' \
  -d '{"name":"Ada"}'
curl -i http://localhost:3000/boom
curl -i http://localhost:3000/index.html
```

What to expect:

| Request | Response |
| --- | --- |
| `GET /` | `{"hello":"world"}` |
| `GET /users/42` | `{"id":"42"}` |
| `GET /search?q=cats&tag=a&tag=b` | `{"q":"cats","tags":["a","b"]}` |
| `POST /users` | `201` and `{"created":{"name":"Ada"}}` |
| `GET /boom` | `503` and `{"error":{"message":"service unavailable"}}` |
| `GET /index.html` | the HTML file as `text/html` |

`GET /missing` falls through the static middleware to routiva's default `404`
JSON.

## Next steps

- [Routing](routing.md) — parameters, wildcards, mounted routers and `router.route`.
- [Middleware](middleware.md) — write your own and understand the stack.
- [Error handling](error-handling.md) — `HttpError`, error middleware and safe defaults.
