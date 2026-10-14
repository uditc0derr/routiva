import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { App, serveStatic } from '../src/index.js';
import { start } from './helpers.js';

let dir;

before(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'routiva-static-'));
  await fs.writeFile(path.join(dir, 'hello.txt'), 'hello static');
  await fs.writeFile(path.join(dir, 'app.js'), 'console.log(1)');
  await fs.writeFile(path.join(dir, 'secret.txt'), 'top secret');
  await fs.mkdir(path.join(dir, 'docs'));
  await fs.writeFile(path.join(dir, 'docs', 'index.html'), '<h1>Docs</h1>');
  await fs.writeFile(path.join(dir, '.hidden'), 'nope');
  await fs.writeFile(path.join(dir, 'range.bin'), Buffer.alloc(100, 0x61));
});

after(async () => {
  await fs.rm(dir, { recursive: true, force: true });
});

test('serves files with a Content-Type', async (t) => {
  const app = new App();
  app.use(serveStatic(dir));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/hello.txt`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/plain/);
  assert.equal(await res.text(), 'hello static');

  res = await fetch(`${s.url}/app.js`);
  assert.match(res.headers.get('content-type'), /javascript/);
});

test('serves an index file for directories', async (t) => {
  const app = new App();
  app.use(serveStatic(dir));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/docs/`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '<h1>Docs</h1>');
});

test('missing files fall through to routes by default', async (t) => {
  const app = new App();
  app.use(serveStatic(dir));
  app.get('/spa', (req, res) => res.send('app shell'));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/spa`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'app shell');
});

test('fallthrough:false turns missing files into 404s', async (t) => {
  const app = new App();
  app.use(serveStatic(dir, { fallthrough: false }));
  app.use((err, req, res, next) => res.status(err.status || 500).json({ m: err.message }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/nope.txt`);
  assert.equal(res.status, 404);
});

test('path traversal and dotfiles are blocked', async (t) => {
  const app = new App();
  app.use(serveStatic(dir));
  app.use((req, res) => res.status(418).send('fell through'));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/%2e%2e/%2e%2e/etc/passwd`);
  assert.equal(res.status, 418);

  res = await fetch(`${s.url}/.hidden`);
  assert.equal(res.status, 418);
});

test('supports ETag conditional requests and Range requests', async (t) => {
  const app = new App();
  app.use(serveStatic(dir, { maxAge: 60000 }));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/range.bin`);
  const etag = res.headers.get('etag');
  assert.ok(etag);
  assert.match(res.headers.get('cache-control'), /max-age=60/);

  res = await fetch(`${s.url}/range.bin`, { headers: { 'if-none-match': etag } });
  assert.equal(res.status, 304);

  res = await fetch(`${s.url}/range.bin`, { headers: { range: 'bytes=0-9' } });
  assert.equal(res.status, 206);
  assert.equal(res.headers.get('content-range'), 'bytes 0-9/100');
  assert.equal((await res.arrayBuffer()).byteLength, 10);
});

test('accepts duration strings for maxAge', async (t) => {
  const app = new App();
  app.use(serveStatic(dir, { maxAge: '1h' }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/hello.txt`);
  assert.match(res.headers.get('cache-control'), /max-age=3600/);
});

test('res.sendFile and res.download', async (t) => {
  const app = new App();
  app.get('/send', (req, res) => res.sendFile(path.join(dir, 'hello.txt')));
  app.get('/dl', (req, res) => res.download(path.join(dir, 'secret.txt'), 'report.txt'));

  const s = await start(app);
  t.after(() => s.close());

  let res = await fetch(`${s.url}/send`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'hello static');

  res = await fetch(`${s.url}/dl`);
  assert.match(res.headers.get('content-disposition'), /^attachment; filename="report.txt"/);
  assert.equal(await res.text(), 'top secret');
});
