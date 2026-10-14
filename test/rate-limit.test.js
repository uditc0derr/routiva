import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, rateLimit, MemoryStore } from '../src/index.js';
import { start } from './helpers.js';

test('allows requests up to the limit, then returns 429', async (t) => {
  const app = new App();
  app.use(rateLimit({ windowMs: 5_000, max: 2 }));
  app.get('/', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-ratelimit-limit'), '2');
  assert.equal(res.headers.get('x-ratelimit-remaining'), '1');

  res = await fetch(`${s.url}/`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-ratelimit-remaining'), '0');

  res = await fetch(`${s.url}/`);
  assert.equal(res.status, 429);
  assert.ok(Number(res.headers.get('retry-after')) >= 1);
  assert.equal((await res.json()).error.status, 429);
});

test('separate clients are limited independently', async (t) => {
  const app = new App();
  app.use(rateLimit({ windowMs: 5_000, max: 1, keyGenerator: (req) => req.query.client }));
  app.get('/', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  assert.equal((await fetch(`${s.url}/?client=a`)).status, 200);
  assert.equal((await fetch(`${s.url}/?client=a`)).status, 429);
  assert.equal((await fetch(`${s.url}/?client=b`)).status, 200);
});

test('custom handler is used when the limit is exceeded', async (t) => {
  const app = new App();
  app.use(
    rateLimit({
      windowMs: 5_000,
      max: 0,
      handler: (req, res) => res.status(503).send('slow down'),
    }),
  );
  app.get('/', (req, res) => res.send('ok'));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/`);
  assert.equal(res.status, 503);
  assert.equal(await res.text(), 'slow down');
});

test('MemoryStore tracks and expires windows', () => {
  const store = new MemoryStore(20);
  const record = store.hit('ip');
  assert.equal(record.count, 1);
  assert.equal(store.hit('ip').count, 2);
  assert.equal(store.size, 1);
  store.reset('ip');
  assert.equal(store.size, 0);
  store.stop();
});
