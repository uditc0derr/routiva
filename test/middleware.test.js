import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, Router } from '../src/index.js';
import { start } from './helpers.js';

test('middleware runs in registration order before routes', async (t) => {
  const order = [];
  const app = new App();
  app.use((req, res, next) => {
    order.push('first');
    next();
  });
  app.use((req, res, next) => {
    order.push('second');
    next();
  });
  app.get('/x', (req, res) => {
    order.push('route');
    res.json({ order });
  });

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/x`);
  assert.deepEqual((await res.json()).order, ['first', 'second', 'route']);
});

test('a middleware can short-circuit the chain', async (t) => {
  const app = new App();
  let reached = false;
  app.use((req, res) => res.status(401).json({ error: 'unauthorized' }));
  app.get('/secret', (req, res) => {
    reached = true;
    res.send('secret');
  });

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/secret`);
  assert.equal(res.status, 401);
  assert.equal(reached, false);
});

test('multiple handlers run in sequence when next() is called', async (t) => {
  const app = new App();
  app.get(
    '/multi',
    (req, res, next) => {
      res.set('X-One', '1');
      next();
    },
    (req, res) => res.json({ done: true }),
  );

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/multi`);
  assert.equal(res.headers.get('x-one'), '1');
  assert.deepEqual(await res.json(), { done: true });
});

test('routers can be mounted under a path prefix', async (t) => {
  const api = new Router();
  api.get('/hello/:name', (req, res) => res.json({ hello: req.params.name }));

  const app = new App();
  app.use('/api', api);
  app.use('/api/v2', api);

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/api/hello/ada`);
  assert.deepEqual(await res.json(), { hello: 'ada' });

  res = await fetch(`${s.url}/api/v2/hello/grace`);
  assert.deepEqual(await res.json(), { hello: 'grace' });

  res = await fetch(`${s.url}/other/hello/ada`);
  assert.equal(res.status, 404);
});

test('mounted middleware sees the path without its prefix', async (t) => {
  const app = new App();
  app.use('/admin', (req, res) => res.json({ path: req.path }));
  app.use((req, res) => res.json({ path: req.path }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/admin/settings`);
  assert.deepEqual(await res.json(), { path: '/settings' });
});
