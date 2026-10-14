---
title: Installation
description: Install routiva from npm, verify your runtime, and run the bundled demo and test suite.
section: Introduction
order: 2
---

## Requirements

routiva runs on **Node.js 18 or newer** and ships as pure ESM. There is no
compiler, bundler or transpile step.

| Requirement | Detail |
| --- | --- |
| Node.js | 18.0.0 or newer (`"engines": { "node": ">=18" }`) |
| Module system | ESM — set `"type": "module"`, or use `.mjs` files |
| Runtime dependencies | none |
| Dev dependencies | none |
| Build step | none |

If your project is CommonJS, add `"type": "module"` to its `package.json` and
switch `require` calls to `import`. routiva ships no CommonJS build.

## Install

```bash
npm install routiva
```

That installs exactly one package. routiva declares no `dependencies` and no
`devDependencies`, so the install tree is just `node_modules/routiva`.

## Named exports and the default export

The package has one entry point (`src/index.js`) with both named and default
exports.

Named exports give you the whole toolkit in one import:

```js
import { createApp, Router, HttpError, json, serveStatic } from 'routiva';

const app = createApp();
```

The default export is the `App` class. `createApp(options)` is simply
`new App(options)`:

```js
import App from 'routiva';

const app = new App();
```

The middleware factories are also attached to the class as statics
(`App.json()`, `App.logger()`, `App.serveStatic()`, `App.rateLimit()`, and so
on), so this works too:

```js
import { App } from 'routiva';

app.use(App.logger());
app.use(App.json());
```

Print the full export list to confirm what is available:

```bash
node -e "import('routiva').then(m => console.log(Object.keys(m).sort().join(' ')))"
```

## Verify your setup

Create `server.js`:

```js
import { createApp } from 'routiva';

const app = createApp();

app.get('/', (req, res) => {
  res.json({ status: 'ok', node: process.version });
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

```bash
node server.js
curl http://localhost:3000/
```

You should get back `{"status":"ok","node":"v18.x.x"}` (your version may
differ). If that prints, routing, JSON responses and the HTTP server all work.

## Zero dependencies

No runtime dependencies and no dev dependencies. The test suite is built on
`node:test` and the global `fetch`, so nothing is installed to run or verify
the project.

```text
$ npm ls --all
routiva@0.1.2
└── (empty)
```

That also means faster installs, smaller container images, and a supply-chain
surface of exactly one package.

## Run the tests

From a clone of the repository:

```bash
node --test          # or: npm test
npm run test:watch   # re-run on change
```

The suite is 16 test files and 78 tests covering routing, params, request and
response APIs, middleware ordering, error propagation, body parsing, cookies,
content negotiation, static files, CORS, compression, rate limiting and
logging. It starts real HTTP servers on ephemeral ports and makes real
requests — there are no mocks.

## Run the bundled demo

The repository ships a complete CRUD app you can run against the source:

```bash
npm run crud          # node crud-app/server.js
```

It listens on **port 3000** and serves a browser UI at
<http://127.0.0.1:3000> plus a JSON API at `/api/products`. Override the
defaults with environment variables:

```bash
PORT=4000 HOST=0.0.0.0 DATA_FILE=./tmp/products.json npm run crud
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Listening port |
| `HOST` | `127.0.0.1` | Listening host |
| `DATA_FILE` | `crud-app/data/products.json` | JSON file used as the datastore |

Run the app's integration tests on their own:

```bash
npm run crud:test     # node --test crud-app/test/crud.test.js
npm run crud:smoke    # bash crud-app/curl.sh — end-to-end curl script
```

`npm run example` runs the smaller `examples/basic.js` demo instead.

## TypeScript

routiva ships as plain JavaScript with no bundled type declarations and no
`.d.ts` files. With `"allowJs": true` in your `tsconfig.json`, TypeScript will
import it and infer what it can from the source. Expect some `any` — there are
no generated types yet.

## No build step

`package.json` points `main` and `exports` straight at `src/index.js`. There is
no `dist/`, no bundler config and no prepare script: the code you import is the
code in the repository.

## Where to go next

| If you want to… | Read |
| --- | --- |
| Build a small app step by step | [Quick start](quick-start.md) |
| Understand the layer stack | [Core concepts](core-concepts.md) |
| Look up a method or option | [API reference](api-reference.md) |
