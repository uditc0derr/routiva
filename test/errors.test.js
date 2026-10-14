import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, HttpError } from '../src/index.js';
import { start } from './helpers.js';

test('errors propagate to error middleware', async (t) => {
  const app = new App();
  app.get('/sync', () => {
    throw new Error('sync boom');
  });
  app.get('/async', async () => {
    throw new Error('async boom');
  });
  app.get('/next', (req, res, next) => next(new HttpError(400, 'bad input')));
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ handled: true, message: err.message });
  });

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/sync`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { handled: true, message: 'sync boom' });

  res = await fetch(`${s.url}/async`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { handled: true, message: 'async boom' });

  res = await fetch(`${s.url}/next`);
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { handled: true, message: 'bad input' });
});

test('unhandled errors fall through to the default error response', async (t) => {
  const app = new App({ env: 'production' });
  app.get('/boom', () => {
    throw new Error('secret detail');
  });

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/boom`);
  assert.equal(res.status, 500);
  const body = await res.json();
  assert.equal(body.error.message, 'Internal Server Error');
  assert.equal(body.error.stack, undefined);
});

test('duplicate sends are ignored', async (t) => {
  const app = new App();
  app.get('/double', (req, res) => {
    res.json({ value: 1 });
    res.status(500).json({ value: 2 });
  });

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/double`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { value: 1 });
});

test('error middleware ordering is respected', async (t) => {
  const order = [];
  const app = new App();
  app.get('/boom', () => {
    throw new Error('x');
  });
  app.use((err, req, res, next) => {
    order.push('first-error');
    next(err);
  });
  app.use((err, req, res, next) => {
    order.push('second-error');
    res.status(500).json({ order });
  });

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/boom`);
  assert.deepEqual((await res.json()).order, ['first-error', 'second-error']);
});
