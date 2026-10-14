import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, HttpError } from '../src/index.js';
import { start } from './helpers.js';

test('routes match params, query strings and all five methods', async (t) => {
  const app = new App();
  app.get('/users/:id', (req, res) => res.json({ id: req.params.id, query: req.query }));
  app.post('/users', (req, res) => res.status(201).json({ created: true }));
  app.put('/users/:id', (req, res) => res.json({ method: 'put', id: req.params.id }));
  app.patch('/users/:id', (req, res) => res.json({ method: 'patch', id: req.params.id }));
  app.delete('/users/:id', (req, res) => res.json({ method: 'delete', id: req.params.id }));
  app.get('/files/*', (req, res) => res.json({ wildcard: req.params.wildcard }));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/users/42?tab=posts&tag=a&tag=b`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    id: '42',
    query: { tab: 'posts', tag: ['a', 'b'] },
  });

  res = await fetch(`${s.url}/users`, { method: 'POST' });
  assert.equal(res.status, 201);

  for (const method of ['PUT', 'PATCH', 'DELETE']) {
    res = await fetch(`${s.url}/users/7`, { method });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { method: method.toLowerCase(), id: '7' });
  }

  res = await fetch(`${s.url}/files/a/b/c.txt`);
  assert.deepEqual(await res.json(), { wildcard: 'a/b/c.txt' });

  // Path matches POST /users but the method does not -> 405 with Allow.
  res = await fetch(`${s.url}/users`);
  assert.equal(res.status, 405);
  assert.match(res.headers.get('allow'), /POST/);
  assert.match(res.headers.get('allow'), /OPTIONS/);
});

test('HEAD requests reuse GET routes without a body', async (t) => {
  const app = new App();
  app.get('/thing', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/thing`, { method: 'HEAD' });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.ok(Number(res.headers.get('content-length')) > 0);
  assert.equal(await res.text(), '');
});

test('OPTIONS returns an Allow header automatically', async (t) => {
  const app = new App();
  app.get('/resource', (req, res) => res.json({ ok: true }));
  app.post('/resource', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/resource`, { method: 'OPTIONS' });
  assert.equal(res.status, 204);
  const allow = res.headers.get('allow');
  assert.match(allow, /GET/);
  assert.match(allow, /POST/);
  assert.match(allow, /OPTIONS/);
});

test('a route can chain methods via router.route()', async (t) => {
  const app = new App();
  app
    .route('/items')
    .get((req, res) => res.json({ op: 'list' }))
    .post((req, res) => res.status(201).json({ op: 'create' }))
    .delete((req, res) => res.json({ op: 'clear' }));

  const s = await start(app);
  t.after(() => s.close());

  assert.deepEqual(await (await fetch(`${s.url}/items`)).json(), { op: 'list' });
  assert.deepEqual(
    await (await fetch(`${s.url}/items`, { method: 'POST' })).json(),
    { op: 'create' },
  );
  assert.deepEqual(
    await (await fetch(`${s.url}/items`, { method: 'DELETE' })).json(),
    { op: 'clear' },
  );
});

test('router.param() runs before matching route handlers', async (t) => {
  const app = new App();
  app.param('id', (req, res, next, value) => {
    if (!/^\d+$/.test(value)) return next(new HttpError(400, 'id must be numeric'));
    req.userId = Number(value);
    next();
  });
  app.get('/users/:id', (req, res) => res.json({ userId: req.userId }));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/users/42`);
  assert.deepEqual(await res.json(), { userId: 42 });

  res = await fetch(`${s.url}/users/abc`);
  assert.equal(res.status, 400);
});

test('params are URL-decoded and trailing slashes are tolerated', async (t) => {
  const app = new App();
  app.get('/hello/:name', (req, res) => res.json({ name: req.params.name }));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/hello/john%20doe`);
  assert.deepEqual(await res.json(), { name: 'john doe' });

  res = await fetch(`${s.url}/hello/jane/`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { name: 'jane' });
});

test('unmatched route returns a structured 404', async (t) => {
  const app = new App();
  app.get('/exists', (req, res) => res.send('ok'));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/nope`);
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.error.status, 404);
  assert.equal(body.error.message, 'Not Found');
});
