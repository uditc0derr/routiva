import { test } from 'node:test';
import assert from 'node:assert/strict';
import App, { createApp, Router, HttpError } from '../src/index.js';
import { start } from './helpers.js';

test('createApp returns an App instance', () => {
  assert.ok(createApp() instanceof App);
});

test('App exposes middleware factories as statics', () => {
  assert.equal(typeof App.json, 'function');
  assert.equal(typeof App.urlencoded, 'function');
  assert.equal(typeof App.logger, 'function');
  assert.equal(typeof App.rateLimit, 'function');
  assert.equal(App.Router, Router);
  assert.equal(App.HttpError, HttpError);
});

test('an end-to-end app wires everything together', async (t) => {
  const app = new App();
  app.use(App.json());

  const api = new Router();
  api.get('/items', (req, res) => res.json({ items: [], limit: req.query.limit ?? '10' }));
  api.post('/items', (req, res) => res.status(201).json({ created: req.body }));
  app.use('/api', api);

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: { message: err.message } });
  });

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/health`);
  assert.deepEqual(await res.json(), { status: 'ok' });

  res = await fetch(`${s.url}/api/items?limit=5`);
  assert.deepEqual(await res.json(), { items: [], limit: '5' });

  res = await fetch(`${s.url}/api/items`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'widget' }),
  });
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { created: { name: 'widget' } });
});

test('listen returns the underlying server with an address', async () => {
  const app = new App();
  app.get('/', (req, res) => res.send('ok'));
  const s = await start(app);
  try {
    assert.equal(typeof s.server.address().port, 'number');
    assert.ok(s.server.address().port > 0);
  } finally {
    await s.close();
  }
});
