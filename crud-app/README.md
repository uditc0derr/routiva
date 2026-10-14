# CRUD app — routiva instead of Express

A small but complete **inventory / products** application built entirely on
[routiva](../README.md). It has a real REST API, persistent storage, validation,
a browser UI, automated tests and a one-command smoke test.

The point of this folder is to show how a normal Express app maps onto routiva:
same mental model (routes + middleware + `next`), same handler signatures, but
zero dependencies and a few better defaults.

---

## Run it

```bash
# from the repository root
npm run crud            # or: node crud-app/server.js
```

Then open:

| URL | What |
| --- | --- |
| <http://127.0.0.1:3000> | Browser UI (create/edit/delete/restock/search) |
| <http://127.0.0.1:3000/api/products> | JSON API |
| <http://127.0.0.1:3000/api/health> | Health check |

Environment variables: `PORT` (default `3000`), `HOST` (default `127.0.0.1`),
`DATA_FILE` (default `crud-app/data/products.json`).

The app seeds five sample products on first run.

---

## Test it

Three ways, from lightest to most thorough:

### 1. Browser

`npm run crud`, open <http://127.0.0.1:3000>, add a product, edit it, restock it,
delete it, and try the search/filter/sort controls. The badge in the corner shows
the API status.

### 2. curl smoke test (no extra tooling)

```bash
./crud-app/curl.sh
```

This boots the app on a throwaway data file on port `4123`, runs every endpoint
(create → read → update → restock → validation → duplicate → 405 → delete →
stats), prints the responses with status codes, and cleans up after itself. You
should see a `✓ smoke test complete` at the end.

### 3. Automated integration tests

```bash
npm test                              # runs the whole repo suite
node --test crud-app/test/crud.test.js   # just this app
```

The suite (15 tests) starts the app on an ephemeral port with a temp data file
and exercises the full lifecycle, validation, pagination, filtering, `405`,
`400`/`404`/`409`/`422`, and on-disk persistence.

There is also a `crud-app/requests.http` file for the VS Code *REST Client* or
JetBrains HTTP client.

---

## API reference

Base path: `/api`. All bodies are JSON. Errors use a consistent envelope:

```json
{ "error": { "message": "Validation failed", "status": 422, "details": { "name": "name is required" } } }
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

**List query options:** `search`, `category`, `inStock=true|false`,
`sort=created|name|price|stock`, `order=asc|desc`, `page`, `limit` (max 100).

**Product fields:** `id`, `name`, `sku` (unique), `price`, `stock`, `category`,
`createdAt`, `updatedAt`.

**Status codes used:** `200`, `201`, `204`, `400` (bad id), `404`, `405` (wrong
method, with `Allow`), `409` (duplicate SKU), `413` (body too large), `422`
(validation), `429` (rate limited).

---

## How the routiva code works

```
crud-app/
  server.js              entry point: createApp() + listen + graceful shutdown
  app.js                 createApp(): middleware order, routes, error handler
  store.js               file-backed JSON store (atomic writes)
  validate.js            pure validation returning { ok, data, errors }
  routes/products.js     a routiva Router with all CRUD endpoints
  public/                static single-page frontend (served by serveStatic)
  test/crud.test.js      15 integration tests (node:test + fetch)
  curl.sh                end-to-end smoke test
  requests.http          REST-client requests
  data/products.json     persisted data (created at runtime)
```

### The Express → routiva mapping

| Express | routiva (this app) |
| --- | --- |
| `const express = require('express')` | `import { App } from '../src/index.js'` |
| `app.use(express.json())` | `app.use(json({ limit: '100kb' }))` |
| `app.use(cors())` | `app.use(cors())` |
| `app.use(compression())` | `app.use(compress())` |
| `app.use(morgan('dev'))` | `app.use(logger())` |
| `app.use(rateLimit(...))` | `app.use(rateLimit({ ... }))` |
| `app.use(express.static('public'))` | `app.use(serveStatic(publicDir))` |
| `const router = express.Router()` | `const router = new Router()` |
| `router.param('id', fn)` | `router.param('id', fn)` — same signature |
| `app.use('/api', router)` | `app.use('/api', router)` — prefix stripped |
| `app.use((err, req, res, next) => …)` | identical (4-arity = error handler) |
| `async` handler throw → hangs (v4) | rejection is forwarded automatically |

The handler signatures are the same, so nearly every Express route body copies
over unchanged:

```js
// Express
app.get('/products/:id', (req, res) => {
  const product = store.get(Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'not found' });
  res.json(product);
});
```

```js
// routiva (this app) — load once via router.param, then:
router.get('/products/:id', (req, res) => res.json(req.product));
```

### Where routiva earns its keep here

- **Zero dependencies.** `npm install` installs nothing; the container image is
  just Node + this folder.
- **Async errors just work.** `store.create()` / `store.update()` are `await`ed
  in `async` handlers; a rejection flows straight to the error middleware.
- **`405` with `Allow`** for free — `POST /api/products/1` returns `405` and a
  correct `Allow` header instead of a misleading `404`.
- **Write-once responses.** A stray second `res.json()` can't crash the process.

---

## Swapping the store for a real database

`routes/products.js` only calls `store.list/get/findBySku/categories/stats/
create/update/remove`. Implement those methods against Postgres, SQLite or Mongo
in `store.js` and the rest of the app — routes, validation, error handling,
tests — is unchanged.
