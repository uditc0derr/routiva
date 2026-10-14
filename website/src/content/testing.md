---
title: Testing
description: Test routiva apps with node --test and global fetch, bind servers to port 0, and run the CRUD demo suite.
section: Guides
order: 2
---

## No test framework to install

routiva tests itself with the runner that ships with Node: `node --test`. Test
files import `test` from `node:test` and assertions from `node:assert/strict`.
There is no mocha, no jest and no `supertest` to audit.

```bash
npm test              # node --test, runs test/
npm run test:watch    # node --test --watch
```

`node --test` discovers `test/**/*.test.js` and runs each file in its own
process. Two suites live in the repo: `test/` and `crud-app/test/`.

## Make real requests

Tests start a server and talk to it over HTTP with the global `fetch`. That
exercises the wrappers, the router, the middleware and Node's socket code
together, which is where framework bugs actually surface.

Bind to port `0` and let the OS pick the port:

```js
const server = app.listen(0);
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
```

Fixed ports collide between parallel runs; port `0` removes the problem.

## A small start helper

`test/helpers.js` wraps the pattern so each file does not repeat it:

```js
import { once } from 'node:events';

export async function start(app) {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  return {
    server,
    url: `http://127.0.0.1:${port}`,
    async close() {
      if (!server.listening) return;
      server.close();
      await once(server, 'close');
    },
  };
}
```

## A full test file

The shape used across the repo: build the app, start it once in `before`, close
it in `after`, and assert status, headers and body from `fetch`.

```js
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, json } from 'routiva';

let server;
let base;

before(async () => {
  const app = createApp();
  app.use(json());

  app.get('/hello', (req, res) => res.json({ hello: 'world' }));
  app.post('/echo', (req, res) => res.status(201).json(req.body));
  app.get('/boom', () => {
    throw new Error('nope');
  });
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /hello returns JSON', async () => {
  const res = await fetch(`${base}/hello`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await res.json(), { hello: 'world' });
});

test('POST /echo returns the parsed body', async () => {
  const res = await fetch(`${base}/echo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ n: 1 }),
  });
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { n: 1 });
});

test('a thrown error reaches the error middleware', async () => {
  const res = await fetch(`${base}/boom`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'nope' });
});
```

`before` and `after` are exported by `node:test` and scoped to the file.

## Assert the things that break

- **Status first.** A wrong status usually means the route did not match, or a
  middleware swallowed the request.
- **Headers that carry meaning.** `Allow` on a `405`, `Location` on a `201`,
  `Content-Type` on JSON, `Content-Encoding` on a compressed response.
- **JSON shape, not string form.** `assert.deepEqual(await res.json(), {...})`
  survives key ordering and whitespace.

## Test middleware in isolation

Mount only the middleware under test and assert its observable behaviour. It is
faster to write and isolates the failure:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, cors } from 'routiva';
import { start } from './helpers.js';

test('cors reflects the origin when credentials are on', async (t) => {
  const app = createApp();
  app.use(cors({ origin: true, credentials: true }));
  app.get('/', (req, res) => res.send('ok'));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(s.url, { headers: { origin: 'https://example.com' } });
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://example.com');
});
```

`t.after()` scopes teardown to one test; `before` and `after` scope it to the
file.

## Testing the CRUD demo

The demo has its own end-to-end checks:

```bash
npm run crud:test     # node --test crud-app/test/crud.test.js
npm run crud:smoke    # bash crud-app/curl.sh
```

`crud-app/test/crud.test.js` builds the app with a temporary data file, logging
off and a high rate limit, then walks the full lifecycle: create, read, update,
restock, validation, duplicate SKU, `405`, delete and on-disk persistence. The
same discipline applies to your app: expose it as a factory that takes its
configuration, so a test can point it at a temp path and an ephemeral port.

`crud-app/curl.sh` takes a different route. It boots the real server on port
`4123` against a throwaway file, drives every endpoint with `curl` and prints
status codes, then cleans up. `crud-app/requests.http` holds the same calls for
the VS Code REST Client or the JetBrains HTTP client.

## Scripts

| Command | What it runs |
| --- | --- |
| `npm test` | `node --test`, the framework suite |
| `npm run test:watch` | `node --test --watch` |
| `npm run crud:test` | `node --test crud-app/test/crud.test.js` |
| `npm run crud:smoke` | `bash crud-app/curl.sh` |
| `npm run crud` | `node crud-app/server.js` |
| `npm run example` | `node examples/basic.js` |

## Tips

- **Avoid fixed ports.** Use `listen(0)` plus `server.address().port`.
- **Always close servers.** Use `t.after` or `after` so a failed assertion
  cannot leave a socket open and hang the runner.
- **Disable logging in tests.** Pass `logger({ enabled: false })` or a config
  flag so the output stays readable.
- **Use a raw `http` request when `fetch` hides the truth.** `fetch` decodes
  compressed bodies automatically, so the compression test uses the `request()`
  helper in `test/helpers.js` to read bytes and headers directly.
- **Raise rate limits for the suite.** The CRUD app takes `rateLimitMax` as a
  parameter, so hundreds of requests do not trip a production limit.
