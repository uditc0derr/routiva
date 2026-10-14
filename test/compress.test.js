import { test } from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import { App, compress } from '../src/index.js';
import { request, start } from './helpers.js';

const LONG = 'x'.repeat(5000);

test('compresses large responses with gzip when accepted', async (t) => {
  const app = new App();
  app.use(compress({ threshold: '100b' }));
  app.get('/big', (req, res) => res.json({ data: LONG }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await request(`${s.url}/big`, { headers: { 'accept-encoding': 'gzip' } });
  assert.equal(res.headers['content-encoding'], 'gzip');
  assert.match(res.headers.vary, /Accept-Encoding/);

  const decoded = zlib.gunzipSync(res.body).toString('utf8');
  assert.deepEqual(JSON.parse(decoded), { data: LONG });
});

test('does not compress small responses below the threshold', async (t) => {
  const app = new App();
  app.use(compress({ threshold: '10kb' }));
  app.get('/small', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await request(`${s.url}/small`, { headers: { 'accept-encoding': 'gzip' } });
  assert.equal(res.headers['content-encoding'], undefined);
  assert.deepEqual(JSON.parse(res.body.toString('utf8')), { ok: true });
});

test('passes through when no supported encoding is accepted', async (t) => {
  const app = new App();
  app.use(compress({ threshold: '100b' }));
  app.get('/big', (req, res) => res.json({ data: LONG }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await request(`${s.url}/big`, { headers: { 'accept-encoding': 'identity' } });
  assert.equal(res.headers['content-encoding'], undefined);
  assert.deepEqual(JSON.parse(res.body.toString('utf8')), { data: LONG });
});

test('supports brotli when preferred', async (t) => {
  const app = new App();
  app.use(compress({ threshold: '100b' }));
  app.get('/big', (req, res) => res.send(LONG));

  const s = await start(app);
  t.after(() => s.close());

  const res = await request(`${s.url}/big`, { headers: { 'accept-encoding': 'br' } });
  assert.equal(res.headers['content-encoding'], 'br');
  assert.equal(zlib.brotliDecompressSync(res.body).toString('utf8'), LONG);
});
