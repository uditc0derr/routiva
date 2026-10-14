import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, cors } from '../src/index.js';
import { start } from './helpers.js';

test('CORS sets a wildcard origin by default', async (t) => {
  const app = new App();
  app.use(cors());
  app.get('/', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/`, { headers: { origin: 'https://example.com' } });
  assert.equal(res.headers.get('access-control-allow-origin'), '*');
});

test('CORS reflects origin when credentials are enabled', async (t) => {
  const app = new App();
  app.use(cors({ origin: true, credentials: true }));
  app.get('/', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/`, { headers: { origin: 'https://example.com' } });
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://example.com');
  assert.equal(res.headers.get('access-control-allow-credentials'), 'true');
  assert.match(res.headers.get('vary'), /Origin/);
});

test('CORS answers preflight OPTIONS requests', async (t) => {
  const app = new App();
  app.use(cors({ origin: 'https://app.test', methods: ['GET', 'POST'], maxAge: 600 }));
  app.get('/', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/`, {
    method: 'OPTIONS',
    headers: {
      origin: 'https://app.test',
      'access-control-request-method': 'POST',
      'access-control-request-headers': 'x-token',
    },
  });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://app.test');
  assert.equal(res.headers.get('access-control-allow-methods'), 'GET,POST');
  assert.equal(res.headers.get('access-control-allow-headers'), 'x-token');
  assert.equal(res.headers.get('access-control-max-age'), '600');
});

test('CORS rejects a disallowed origin', async (t) => {
  const app = new App();
  app.use(cors({ origin: ['https://good.test'] }));
  app.get('/', (req, res) => res.json({ ok: true }));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(`${s.url}/`, { headers: { origin: 'https://evil.test' } });
  assert.equal(res.headers.get('access-control-allow-origin'), null);
});
