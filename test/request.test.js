import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, json } from '../src/index.js';
import { start } from './helpers.js';

test('request exposes params, query, body and ip', async (t) => {
  const app = new App();
  app.use(json());
  app.post('/echo/:name', (req, res) =>
    res.json({
      name: req.params.name,
      query: req.query,
      body: req.body,
      method: req.method,
      path: req.path,
      hasIp: typeof req.ip === 'string',
      contentType: req.get('content-type'),
    }),
  );

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/echo/ada?draft=1`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ hello: 'world' }),
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.name, 'ada');
  assert.deepEqual(body.query, { draft: '1' });
  assert.deepEqual(body.body, { hello: 'world' });
  assert.equal(body.method, 'POST');
  assert.equal(body.path, '/echo/ada');
  assert.equal(body.hasIp, true);
  assert.match(body.contentType, /application\/json/);
});

test('body is undefined when no parser is installed', async (t) => {
  const app = new App();
  app.post('/raw', (req, res) => res.json({ body: req.body ?? null }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/raw`, { method: 'POST', body: '{"a":1}' });
  assert.deepEqual(await res.json(), { body: null });
});
