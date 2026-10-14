import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../app.js';

let server;
let base;
let dataDir;
let dataFile;

before(async () => {
  dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'routiva-crud-'));
  dataFile = path.join(dataDir, 'products.json');

  const { app } = await createApp({
    dataFile,
    logging: false,
    seed: false,
    rateLimitMax: 100_000,
  });

  server = app.listen(0);
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await fs.rm(dataDir, { recursive: true, force: true });
});

async function request(path, options = {}) {
  const res = await fetch(base + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await res.text();
  return { res, body: text ? JSON.parse(text) : null };
}

const create = (overrides = {}) =>
  request('/api/products', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Product',
      sku: `SKU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      price: 10,
      stock: 5,
      category: 'test',
      ...overrides,
    }),
  });

test('GET /api/health reports ok', async () => {
  const { res, body } = await request('/api/health');
  assert.equal(res.status, 200);
  assert.equal(body.status, 'ok');
});

test('POST /api/products creates a product with defaults and Location', async () => {
  const { res, body } = await request('/api/products', {
    method: 'POST',
    body: JSON.stringify({ name: 'Camera', sku: 'CAM-1', price: 59.99, stock: 7 }),
  });
  assert.equal(res.status, 201);
  assert.equal(res.headers.get('location'), `/api/products/${body.id}`);
  assert.equal(body.name, 'Camera');
  assert.equal(body.sku, 'CAM-1');
  assert.equal(body.price, 59.99);
  assert.equal(body.category, 'general');
  assert.equal(body.completed, undefined);
  assert.ok(body.createdAt);
});

test('POST /api/products returns 422 with field details for bad input', async () => {
  const { res, body } = await request('/api/products', {
    method: 'POST',
    body: JSON.stringify({ name: '', sku: 'bad sku', price: -1 }),
  });
  assert.equal(res.status, 422);
  assert.equal(body.error.message, 'Validation failed');
  assert.ok(body.error.details.name);
  assert.ok(body.error.details.sku);
  assert.ok(body.error.details.price);
  assert.ok(body.error.details.stock);
});

test('POST /api/products rejects a duplicate SKU with 409', async () => {
  await create({ sku: 'DUP-1' });
  const { res, body } = await create({ sku: 'DUP-1' });
  assert.equal(res.status, 409);
  assert.match(body.error.message, /already exists/);
});

test('GET /api/products paginates and reports totals', async () => {
  await create({ name: 'P1', category: 'pagination' });
  await create({ name: 'P2', category: 'pagination' });
  await create({ name: 'P3', category: 'pagination' });

  const { res, body } = await request(
    '/api/products?category=pagination&limit=2&page=1',
  );
  assert.equal(res.status, 200);
  assert.equal(body.data.length, 2);
  assert.equal(body.total, 3);
  assert.equal(body.pages, 2);
  assert.equal(body.page, 1);
});

test('GET /api/products supports search, filter and sort', async () => {
  await create({ name: 'Alpha Widget', sku: 'ALPHA-1', price: 5, category: 'sortme' });
  await create({ name: 'Beta Widget', sku: 'BETA-1', price: 50, category: 'sortme' });

  const search = await request('/api/products?category=sortme&search=alpha');
  assert.equal(search.body.total, 1);
  assert.equal(search.body.data[0].name, 'Alpha Widget');

  const sorted = await request('/api/products?category=sortme&sort=price&order=desc');
  assert.equal(sorted.body.data[0].name, 'Beta Widget');
});

test('GET /api/products/:id returns one product and 404s for missing', async () => {
  const { body: created } = await create({ name: 'Single', sku: 'SINGLE-1' });

  const found = await request(`/api/products/${created.id}`);
  assert.equal(found.res.status, 200);
  assert.equal(found.body.id, created.id);

  const missing = await request('/api/products/999999');
  assert.equal(missing.res.status, 404);
  assert.equal(missing.body.error.message, 'product not found');
});

test('GET /api/products/:id rejects a non-numeric id with 400', async () => {
  const { res, body } = await request('/api/products/not-a-number');
  assert.equal(res.status, 400);
  assert.match(body.error.message, /positive integer/);
});

test('PATCH /api/products/:id updates only supplied fields', async () => {
  const { body: created } = await create({ name: 'Patch Me', sku: 'PATCH-1', price: 20, stock: 4 });

  const { res, body } = await request(`/api/products/${created.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ stock: 99 }),
  });
  assert.equal(res.status, 200);
  assert.equal(body.stock, 99);
  assert.equal(body.name, 'Patch Me'); // untouched
  assert.equal(body.price, 20); // untouched
});

test('PATCH /api/products/:id with an empty body is a 422', async () => {
  const { body: created } = await create({ sku: `EMPTY-${Date.now()}` });
  const { res } = await request(`/api/products/${created.id}`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 422);
});

test('PUT /api/products/:id replaces the resource', async () => {
  const { body: created } = await create({ name: 'Old Name', sku: 'PUT-1', price: 1, stock: 1 });

  const { res, body } = await request(`/api/products/${created.id}`, {
    method: 'PUT',
    body: JSON.stringify({ name: 'New Name', sku: 'PUT-1', price: 9, stock: 2, category: 'replaced' }),
  });
  assert.equal(res.status, 200);
  assert.equal(body.name, 'New Name');
  assert.equal(body.price, 9);
  assert.equal(body.category, 'replaced');
});

test('POST /api/products/:id/restock increments stock', async () => {
  const { body: created } = await create({ sku: 'RESTOCK-1', stock: 3 });
  const { res, body } = await request(`/api/products/${created.id}/restock`, {
    method: 'POST',
    body: JSON.stringify({ amount: 10 }),
  });
  assert.equal(res.status, 200);
  assert.equal(body.stock, 13);

  const bad = await request(`/api/products/${created.id}/restock`, {
    method: 'POST',
    body: JSON.stringify({ amount: 0 }),
  });
  assert.equal(bad.res.status, 422);
});

test('DELETE /api/products/:id removes the product', async () => {
  const { body: created } = await create({ sku: 'DELETE-1' });

  const deleted = await request(`/api/products/${created.id}`, { method: 'DELETE' });
  assert.equal(deleted.res.status, 204);

  const after = await request(`/api/products/${created.id}`);
  assert.equal(after.res.status, 404);
});

test('wrong method on an existing path returns 405 with Allow', async () => {
  const { body: created } = await create({ sku: 'METHOD-1' });
  const { res } = await request(`/api/products/${created.id}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 405);
  const allow = res.headers.get('allow');
  assert.ok(allow.includes('GET'), `Allow was: ${allow}`);
  assert.ok(allow.includes('DELETE'), `Allow was: ${allow}`);
});

test('data is persisted to disk', async () => {
  const { body: created } = await create({ name: 'Persisted', sku: 'PERSIST-1' });
  const raw = await fs.readFile(dataFile, 'utf8');
  const parsed = JSON.parse(raw);
  const stored = parsed.products.find((p) => p.id === created.id);
  assert.ok(stored, 'product should be written to the JSON file');
  assert.equal(stored.name, 'Persisted');
});

test('creates the data directory when it does not exist yet', async () => {
  // Regression: the default data file lives in crud-app/data/, which does not
  // exist on a fresh clone. Seeding must create the directory, not crash.
  const nested = path.join(dataDir, 'fresh', 'deep', 'products.json');
  const { app } = await createApp({
    dataFile: nested,
    logging: false,
    seed: true,
    rateLimitMax: 100_000,
  });

  const srv = app.listen(0);
  await once(srv, 'listening');
  try {
    const res = await fetch(`http://127.0.0.1:${srv.address().port}/api/products`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.total, 5); // seeded sample data

    const raw = await fs.readFile(nested, 'utf8');
    assert.equal(JSON.parse(raw).products.length, 5);
  } finally {
    await new Promise((resolve) => srv.close(resolve));
  }
});
