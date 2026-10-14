import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App } from '../src/index.js';
import { start } from './helpers.js';

test('chainable response helpers', async (t) => {
  const app = new App();
  app.get('/json', (req, res) => res.status(201).json({ ok: true }));
  app.get('/text', (req, res) => res.type('txt').send('hello'));
  app.get('/buffer', (req, res) => res.send(Buffer.from('bytes')));
  app.get('/empty', (req, res) => res.status(204).send());
  app.get('/status', (req, res) => res.sendStatus(418));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/json`);
  assert.equal(res.status, 201);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await res.json(), { ok: true });

  res = await fetch(`${s.url}/text`);
  assert.match(res.headers.get('content-type'), /text\/plain/);
  assert.equal(res.headers.get('content-length'), '5');
  assert.equal(await res.text(), 'hello');

  res = await fetch(`${s.url}/buffer`);
  assert.equal(res.headers.get('content-type'), 'application/octet-stream');
  assert.equal(await res.text(), 'bytes');

  res = await fetch(`${s.url}/empty`);
  assert.equal(res.status, 204);

  res = await fetch(`${s.url}/status`);
  assert.equal(res.status, 418);
  assert.equal(await res.text(), "I'm a Teapot");
});

test('cookies and redirects', async (t) => {
  const app = new App();
  app.get('/login', (req, res) =>
    res
      .cookie('sid', 'abc123', { httpOnly: true, sameSite: 'lax', maxAge: 60_000 })
      .cookie('theme', 'dark')
      .json({ ok: true }),
  );
  app.get('/logout', (req, res) => res.clearCookie('sid').send('bye'));
  app.get('/old', (req, res) => res.redirect('/new'));
  app.get('/moved', (req, res) => res.redirect(301, '/new'));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/login`);
  const cookies = res.headers.getSetCookie();
  assert.equal(cookies.length, 2);
  assert.match(cookies[0], /^sid=abc123; Path=\/; Max-Age=60; Expires=/);
  assert.match(cookies[0], /HttpOnly/);
  assert.match(cookies[0], /SameSite=Lax/);
  assert.match(cookies[1], /^theme=dark; Path=\//);

  res = await fetch(`${s.url}/logout`);
  assert.match(res.headers.getSetCookie()[0], /sid=; Path=\/; Max-Age=0/);

  res = await fetch(`${s.url}/old`, { redirect: 'manual' });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get('location'), '/new');

  res = await fetch(`${s.url}/moved`, { redirect: 'manual' });
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), '/new');
});
