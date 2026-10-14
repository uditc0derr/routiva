import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App } from '../src/index.js';
import { start } from './helpers.js';

test('req.cookies parses the Cookie header, including JSON values', async (t) => {
  const app = new App();
  app.get('/cookies', (req, res) => res.json(req.cookies));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/cookies`, {
    headers: { cookie: 'sid=abc; theme=dark; prefs=j%3A%7B%22a%22%3A1%7D' },
  });
  assert.deepEqual(await res.json(), { sid: 'abc', theme: 'dark', prefs: { a: 1 } });
});

test('req.accepts negotiates content types', async (t) => {
  const app = new App();
  app.get('/type', (req, res) => res.json({ chosen: req.accepts('json', 'html') }));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/type`, { headers: { accept: 'text/html,application/json' } });
  assert.deepEqual(await res.json(), { chosen: 'html' });

  res = await fetch(`${s.url}/type`, { headers: { accept: 'application/json' } });
  assert.deepEqual(await res.json(), { chosen: 'json' });

  res = await fetch(`${s.url}/type`, { headers: { accept: 'image/png' } });
  assert.deepEqual(await res.json(), { chosen: false });
});

test('res.format picks a handler by Accept header', async (t) => {
  const app = new App();
  app.get('/data', (req, res) =>
    res.format({
      json: () => res.json({ format: 'json' }),
      html: () => res.send('<p>html</p>'),
      default: () => res.status(406).send('nope'),
    }),
  );

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/data`, { headers: { accept: 'application/json' } });
  assert.deepEqual(await res.json(), { format: 'json' });

  res = await fetch(`${s.url}/data`, { headers: { accept: 'text/html' } });
  assert.match(res.headers.get('content-type'), /text\/html/);
  assert.equal(await res.text(), '<p>html</p>');

  res = await fetch(`${s.url}/data`, { headers: { accept: 'image/png' } });
  assert.equal(res.status, 406);
});

test('req.is checks the request content type', async (t) => {
  const app = new App();
  app.post('/is', (req, res) => res.json({ json: req.is('json'), form: req.is('form') }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/is`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  });
  assert.deepEqual(await res.json(), { json: true, form: false });
});
