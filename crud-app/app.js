import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  App,
  HttpError,
  logger,
  cors,
  compress,
  rateLimit,
  json,
  serveStatic,
} from '../src/index.js';
import { ProductStore } from './store.js';
import { productsRouter } from './routes/products.js';

const publicDir = fileURLToPath(new URL('./public', import.meta.url));

const SAMPLE_PRODUCTS = [
  { name: 'Mechanical Keyboard', sku: 'KB-100', price: 89.99, stock: 12, category: 'peripherals' },
  { name: 'Wireless Mouse', sku: 'MS-200', price: 34.5, stock: 0, category: 'peripherals' },
  { name: '27" 4K Monitor', sku: 'MON-4K', price: 429, stock: 5, category: 'displays' },
  { name: 'USB-C Hub', sku: 'HUB-7', price: 49.99, stock: 23, category: 'accessories' },
  { name: 'Laptop Stand', sku: 'STAND-1', price: 24.99, stock: 8, category: 'accessories' },
];

/**
 * Build the CRUD application around a routiva `App`.
 *
 * Exported as a factory so tests can create an isolated instance (their own
 * data file, logging off, high rate limit) without starting a listener.
 */
export async function createApp({
  dataFile = process.env.DATA_FILE || path.join(publicDir, '..', 'data', 'products.json'),
  logging = process.env.NODE_ENV !== 'test',
  rateLimitMax = 600,
  seed = true,
} = {}) {
  const store = await new ProductStore(path.resolve(dataFile)).load();
  if (seed) await store.seedIfEmpty(SAMPLE_PRODUCTS);

  const app = new App({ env: process.env.NODE_ENV || 'development' });

  // ── Global middleware (order matters) ──────────────────────────────────────
  app.use(logger({ enabled: logging }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(compress({ threshold: '1kb' }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: rateLimitMax,
      standardHeaders: true,
    }),
  );
  app.use(json({ limit: '100kb' }));

  // ── API ────────────────────────────────────────────────────────────────────
  app.use('/api', productsRouter(store));

  // ── Static single-page frontend ────────────────────────────────────────────
  app.use(serveStatic(publicDir, { maxAge: '5m', extensions: ['html'] }));

  // ── Error handler (4-arity ⇒ runs only when next(err) was called) ─────────
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    let status = err.status || err.statusCode || 500;
    if (err.type === 'entity.parse.failed') status = 400;
    else if (err.type === 'entity.too.large') status = 413;

    if (status >= 500) console.error('[error]', err);

    const payload = {
      error: {
        message: err.expose || status < 500 ? err.message : 'Internal Server Error',
        status,
      },
    };
    if (err.type) payload.error.type = err.type;
    if (err.details) payload.error.details = err.details;

    res.status(status).json(payload);
  });

  return { app, store };
}

export { HttpError };
