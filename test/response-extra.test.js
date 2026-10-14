import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { App } from '../src/index.js';
import { start, tick } from './helpers.js';

test('res.attachment sets Content-Disposition and infers the type', async (t) => {
  const app = new App();
  app.get('/report', (req, res) => res.attachment('report.pdf').send('pdf-bytes'));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/report`);
  assert.match(res.headers.get('content-disposition'), /^attachment; filename="report.pdf"/);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
});

test('res.vary accumulates fields without duplicates', async (t) => {
  const app = new App();
  app.get('/vary', (req, res) => {
    res.vary('Accept').vary('accept').vary('Origin');
    res.json({ ok: true });
  });

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/vary`);
  assert.equal(res.headers.get('vary'), 'Accept, Origin');
});

test('res.sendFile routes missing files into the error chain', async (t) => {
  const app = new App();
  app.get('/missing', (req, res) => res.sendFile('/no/such/file.txt'));
  app.use((err, req, res, next) => res.status(err.status || 500).json({ status: err.status }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/missing`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { status: 404 });
});

test('res.sendFile supports a callback', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'routiva-sf-'));
  const file = path.join(dir, 'note.txt');
  await fs.writeFile(file, 'note body');
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  let called = false;
  const app = new App();
  app.get('/cb', (req, res) => {
    res.sendFile(file, (err) => {
      called = !err;
    });
  });

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/cb`);
  assert.equal(await res.text(), 'note body');
  await tick();
  assert.equal(called, true);
});
