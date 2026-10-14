import { Router, HttpError } from '../../src/index.js';
import { validateProduct } from '../validate.js';

/**
 * The products REST router. Mounted at /api by app.js, so the paths below
 * (`/products`, `/products/:id`, ...) are visible as `/api/products/...`.
 *
 * All handlers are plain functions. Because routiva forwards rejected promises,
 * `async` handlers can simply `throw` and the error middleware will catch it.
 */
export function productsRouter(store) {
  const router = new Router();

  // Load the product once for every route that has an :id and stash it on req.
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

  router.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
  });

  router.get('/stats', (req, res) => {
    res.json(store.stats());
  });

  router.get('/categories', (req, res) => {
    res.json({ data: store.categories() });
  });

  // LIST  ── pagination, search, filter, sort
  router.get('/products', (req, res) => {
    const { query } = req;
    const result = store.list({
      search: query.search,
      category: query.category,
      inStock: parseBool(query.inStock),
      sort: query.sort,
      order: query.order,
      page: clampInt(query.page, 1, 1, 1_000_000, 1),
      limit: clampInt(query.limit, 1, 100, 1_000_000, 10),
    });
    res.json(result);
  });

  // CREATE
  router.post('/products', async (req, res) => {
    const { ok, data, errors } = validateProduct(req.body ?? {});
    if (!ok) throw validationError(errors);
    if (store.findBySku(data.sku)) {
      throw new HttpError(409, `a product with sku ${data.sku} already exists`);
    }
    const product = await store.create(data);
    res.status(201).set('Location', `/api/products/${product.id}`).json(product);
  });

  // READ ONE
  router.get('/products/:id', (req, res) => {
    res.json(req.product);
  });

  // REPLACE
  router.put('/products/:id', async (req, res) => {
    const { ok, data, errors } = validateProduct(req.body ?? {});
    if (!ok) throw validationError(errors);
    if (store.findBySku(data.sku, req.productId)) {
      throw new HttpError(409, `a product with sku ${data.sku} already exists`);
    }
    const product = await store.update(req.productId, data, { replace: true });
    res.json(product);
  });

  // PARTIAL UPDATE
  router.patch('/products/:id', async (req, res) => {
    const { ok, data, errors } = validateProduct(req.body ?? {}, {
      partial: true,
    });
    if (!ok) throw validationError(errors);
    if (Object.keys(data).length === 0) {
      throw validationError({ _: 'provide at least one field to update' });
    }
    if (data.sku && store.findBySku(data.sku, req.productId)) {
      throw new HttpError(409, `a product with sku ${data.sku} already exists`);
    }
    const product = await store.update(req.productId, data);
    res.json(product);
  });

  // CUSTOM ACTION ── add stock
  router.post('/products/:id/restock', async (req, res) => {
    const amount = Number(req.body?.amount);
    if (!Number.isInteger(amount) || amount <= 0) {
      throw validationError({ amount: 'amount must be a positive integer' });
    }
    const product = await store.update(req.productId, {
      stock: req.product.stock + amount,
    });
    res.json(product);
  });

  // DELETE
  router.delete('/products/:id', async (req, res) => {
    await store.remove(req.productId);
    res.status(204).end();
  });

  return router;
}

function validationError(details) {
  const error = new HttpError(422, 'Validation failed');
  error.details = details;
  error.expose = true;
  return error;
}

function clampInt(value, min, fallback, max, fallbackValue) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallbackValue;
  return Math.min(Math.max(n, min), max);
}

function parseBool(value) {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
}
