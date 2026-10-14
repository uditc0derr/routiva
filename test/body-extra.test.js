import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, text, raw } from '../src/index.js';
import { start } from './helpers.js';

test('text() parser assigns a string body', async (t) => {
  const app = new App();
  app.use(text());
  app.post('/t', (req, res) => res.json({ body: req.body, isString: typeof req.body === 'string' }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/t`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'hello world',
  });
  assert.deepEqual(await res.json(), { body: 'hello world', isString: true });
});

test('raw() parser assigns a Buffer', async (t) => {
  const app = new App();
  app.use(raw());
  app.post('/r', (req, res) =>
    res.json({ isBuffer: Buffer.isBuffer(req.body), text: req.body.toString('utf8') }),
  );

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/r`, { method: 'POST', body: 'binary-ish' });
  assert.deepEqual(await res.json(), { isBuffer: true, text: 'binary-ish' });
});
