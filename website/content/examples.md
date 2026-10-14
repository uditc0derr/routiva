---
title: Examples
description: A runnable demo, a complete CRUD API with a browser UI, and focused snippets for routing, errors, uploads, SPA fallbacks and custom middleware.
section: Guides
order: 1
---

## Running the bundled examples

From a clone of the repository:

```bash
npm run example       # node examples/basic.js    → http://localhost:3000
npm run crud          # node crud-app/server.js    → http://127.0.0.1:3000
```

`examples/basic.js` is a single readable file that touches most of the
framework. The CRUD app is a full application with a browser UI, persistent
storage and its own test suite.

## `examples/basic.js`, line by line

The demo registers the built-in middleware in the recommended order, then a
handful of routes.

```js
import { fileURLToPath } from 'node:url';
import { App, Router, HttpError } from '../src/index.js';

const publicDir = fileURLToPath(new URL('./public', import.meta.url));
const app = new App();

// --- Global middleware -----------------------------------------------------
app.use(App.logger());
app.use(App.cors({ origin: true, credentials: true }));
app.use(App.compress());
app.use(App.rateLimit({ windowMs: 60_000, max: 100 }));
app.use(App.json());                    // parse JSON bodies (max 1mb)
app.use(App.serveStatic(publicDir, { maxAge: '1h' }));
```

| Step | Why it is in this order |
| --- | --- |
| `logger()` | Wraps every request so the completion line is always written |
| `cors()` | Answers preflights before any route work |
| `compress()` | Wraps `res.send` before bodies are produced |
| `rateLimit()` | Rejects abusive callers before real work |
| `json()` | Parses only JSON requests, leaves others alone |
| `serveStatic()` | Last, so explicit routes win and misses fall through |

Routes use the wrapped `req`/`res` directly:

```js
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, query: req.query, cookies: req.cookies });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.get('/download', (req, res) => {
  res.download(fileURLToPath(new URL('./public/style.css', import.meta.url)), 'style.css');
});
```

Content negotiation picks a representation from the `Accept` header:

```js
app.get('/greet', (req, res) =>
  res.format({
    json: () => res.json({ hello: req.query.name || 'world' }),
    html: () => res.send(`<h1>Hello ${req.query.name || 'world'}</h1>`),
    default: () => res.status(406).send('Not Acceptable'),
  }),
);
```

A sub-router mounted at a prefix:

```js
const api = new Router();
api.get('/status', (req, res) => res.json({ status: 'ok' }));
app.use('/api', api);          // GET /api/status
```

And an error handler, registered last:

```js
app.get('/boom', () => {
  throw new HttpError(500, 'Something went wrong');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});
```

## The CRUD application

`crud-app/` is a small inventory service built entirely on routiva: a REST API,
a JSON-backed store, a browser UI, validation and tests.

```bash
npm run crud
```

| URL | What |
| --- | --- |
| <http://127.0.0.1:3000> | Browser UI (create / edit / delete / restock / search) |
| <http://127.0.0.1:3000/api/products> | JSON API |
| <http://127.0.0.1:3000/api/health> | Health check |

Configuration is through environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Listening port |
| `HOST` | `127.0.0.1` | Listening host |
| `DATA_FILE` | `crud-app/data/products.json` | JSON datastore |

The app seeds five sample products on first run.

### The API

Base path `/api`. Errors share one envelope:

```json
{ "error": { "message": "Validation failed", "status": 422,
             "details": { "name": "name is required" } } }
```

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness + uptime |
| `GET` | `/api/stats` | Counts and total inventory value |
| `GET` | `/api/categories` | Distinct categories |
| `GET` | `/api/products` | List, with query options below |
| `POST` | `/api/products` | Create → `201` + `Location` |
| `GET` | `/api/products/:id` | Read one → `200` / `404` |
| `PUT` | `/api/products/:id` | Replace → `200` |
| `PATCH` | `/api/products/:id` | Partial update → `200` |
| `POST` | `/api/products/:id/restock` | Add `{ "amount": n }` to stock |
| `DELETE` | `/api/products/:id` | Delete → `204` |

List query options: `search`, `category`, `inStock=true|false`,
`sort=created|name|price|stock`, `order=asc|desc`, `page`, `limit` (max 100).

Try it:

```bash
curl http://127.0.0.1:3000/api/products
curl -X POST http://127.0.0.1:3000/api/products \
  -H 'content-type: application/json' \
  -d '{"name":"Webcam","sku":"CAM-1","price":59.99,"stock":4,"category":"peripherals"}'
curl -X POST http://127.0.0.1:3000/api/products/1/restock \
  -H 'content-type: application/json' -d '{"amount":5}'
curl -X DELETE -i http://127.0.0.1:3000/api/products/1
```

### How it is wired

`crud-app/app.js` exports a `createApp()` **factory** so tests can build an
isolated instance with a temp data file, logging off and a high rate limit:

```js
export async function createApp({ dataFile, logging, rateLimitMax, seed } = {}) {
  const store = await new ProductStore(path.resolve(dataFile)).load();
  if (seed) await store.seedIfEmpty(SAMPLE_PRODUCTS);

  const app = new App({ env: process.env.NODE_ENV || 'development' });

  app.use(logger({ enabled: logging }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(compress({ threshold: '1kb' }));
  app.use(rateLimit({ windowMs: 60_000, max: rateLimitMax }));
  app.use(json({ limit: '100kb' }));

  app.use('/api', productsRouter(store));
  app.use(serveStatic(publicDir, { maxAge: '5m', extensions: ['html'] }));

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    let status = err.status || err.statusCode || 500;
    if (err.type === 'entity.parse.failed') status = 400;
    else if (err.type === 'entity.too.large') status = 413;
    res.status(status).json({ error: { message: err.message, status } });
  });

  return { app, store };
}
```

`crud-app/routes/products.js` is a `Router` mounted at `/api`. It uses
`router.param('id', …)` to load and validate the product **once** for every
route with an `:id`:

```js
router.param('id', (req, res, next, id) => {
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return next(new HttpError(400, 'product id must be a positive integer'));
  }
  const product = store.get(numeric);
  if (!product) return next(new HttpError(404, 'product not found'));
  req.product = product;
  req.productId = numeric;
  next();
});

router.get('/products/:id', (req, res) => res.json(req.product));

router.post('/products', async (req, res) => {
  const { ok, data, errors } = validateProduct(req.body ?? {});
  if (!ok) throw validationError(errors);
  if (store.findBySku(data.sku)) throw new HttpError(409, 'sku already exists');
  const product = await store.create(data);
  res.status(201).set('Location', `/api/products/${product.id}`).json(product);
});
```

Because routiva forwards rejected promises, the `async` handlers `throw` straight
into the error middleware — no `try/catch` and no `next(err)` wrappers.

### Testing it

```bash
npm run crud:test     # node --test crud-app/test/crud.test.js
npm run crud:smoke    # bash crud-app/curl.sh — end-to-end curl script
```

The smoke script boots the app on a throwaway data file and port, drives every
endpoint with `curl`, prints status codes, and cleans up. The full story is on
the [Testing](testing.md) page.

## Focused snippets

### A JSON API with a param and an error handler

```js
import { createApp, json, HttpError } from 'routiva';

const app = createApp();
app.use(json());

const items = new Map();

app.param('id', (req, res, next, id) => {
  const item = items.get(id);
  if (!item) return next(HttpError.notFound('item not found'));
  req.item = item;
  next();
});

app.get('/items/:id', (req, res) => res.json(req.item));
app.put('/items/:id', (req, res) => {
  Object.assign(req.item, req.body);
  res.json(req.item);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message, status: err.status || 500 } });
});

app.listen(3000);
```

### A single-page app fallback

Serve real assets from disk, then return the shell for anything else:

```js
app.use(serveStatic('dist', { index: ['index.html'], extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile('dist/index.html'));
```

See [Static files](static-files.md#single-page-app-fallback) for the details.

### A verified webhook

`json({ verify })` runs on the raw bytes, so a signature check can reject before
the body is parsed:

```js
import { createHmac, timingSafeEqual } from 'node:crypto';
import { json, HttpError } from 'routiva';

app.post('/webhooks/github', json({
  verify(req, res, buffer) {
    const expected = createHmac('sha256', SECRET).update(buffer).digest('hex');
    const received = req.header('x-hub-signature-256') || '';
    const a = Buffer.from(`sha256=${expected}`);
    const b = Buffer.from(received);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new HttpError(401, 'invalid signature');
    }
  },
}), (req, res) => {
  res.json({ received: true, event: req.body });
});
```

More on the parser hooks: [Body parsing](body-parsing.md#verify-and-webhook-signatures).

### Your own middleware

```js
function requestId() {
  let counter = 0;
  return (req, res, next) => {
    const id = `req-${++counter}`;
    req.id = id;
    res.set('X-Request-Id', id);
    next();
  };
}

app.use(requestId());
```

See [Middleware](middleware.md#writing-your-own) for more patterns.

### A per-route rate limit

```js
const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  keyGenerator: (req) => `${req.ip}:${req.body?.email ?? ''}`,
});

app.post('/login', loginLimiter, loginHandler);
```

More: [Rate limiting](rate-limiting.md#per-route-limits).

## Where the files live

```
examples/
  basic.js              runnable demo (static, cors, compress, download, format)
  public/               assets for the demo
crud-app/
  server.js             entry point: createApp() + listen + graceful shutdown
  app.js                createApp(): middleware order, routes, error handler
  store.js              file-backed JSON store (atomic writes)
  validate.js           pure validation returning { ok, data, errors }
  routes/products.js    a Router with the CRUD endpoints
  public/               static single-page frontend
  test/crud.test.js     integration tests (node:test + fetch)
  curl.sh               end-to-end smoke test
  requests.http         REST-client requests
```

## Where to go next

| If you want to… | Read |
| --- | --- |
| Write tests like these | [Testing](testing.md) |
| Reason about performance | [Performance](performance.md) |
| Port an existing Express app | [Coming from Express](express-comparison.md) |
