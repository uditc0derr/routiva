import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, json, urlencoded } from '../src/index.js';
import { start } from './helpers.js';

test('json parser populates req.body', async (t) => {
  const app = new App();
  app.use(json());
  app.post('/j', (req, res) => res.json({ body: req.body }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/j`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ a: 1, nested: { b: 2 } }),
  });
  assert.deepEqual(await res.json(), { body: { a: 1, nested: { b: 2 } } });
});

test('invalid JSON yields a 400', async (t) => {
  const app = new App();
  app.use(json());
  app.post('/j', (req, res) => res.json({ body: req.body }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/j`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{ not json',
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error.type, 'entity.parse.failed');
});

test('non-object JSON is rejected in strict mode', async (t) => {
  const app = new App();
  app.use(json());
  app.post('/j', (req, res) => res.json({ body: req.body }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/j`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '42',
  });
  assert.equal(res.status, 400);
});

test('bodies over the limit yield a 413', async (t) => {
  const app = new App();
  app.use(json({ limit: '1kb' }));
  app.post('/j', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/j`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ data: 'x'.repeat(2000) }),
  });
  assert.equal(res.status, 413);
  assert.equal((await res.json()).error.type, 'entity.too.large');
});

test('parser ignores other content types', async (t) => {
  const app = new App();
  app.use(json());
  app.use(urlencoded());
  app.post('/j', (req, res) => res.json({ body: req.body ?? null }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/j`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'hello',
  });
  assert.deepEqual(await res.json(), { body: null });
});

test('urlencoded parser supports extended notation', async (t) => {
  const app = new App();
  app.use(urlencoded({ extended: true }));
  app.post('/f', (req, res) => res.json({ body: req.body }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/f`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'name=ada&profile[age]=36',
  });
  assert.deepEqual(await res.json(), { body: { name: 'ada', profile: { age: '36' } } });
});
