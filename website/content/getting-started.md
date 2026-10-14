---
title: Getting started
description: What routiva is, the ideas behind it, and a working server in under a minute.
section: Introduction
order: 1
---

## What is routiva?

routiva is a small web framework for Node.js that gives you the ergonomics of
Express — routing, middleware, request/response helpers, body parsing, static
files, CORS, compression, logging and rate limiting — while staying completely
dependency-free.

Everything is built on Node's own `node:http`. There is no `path-to-regexp`, no
`body-parser`, no `mime-types`, no transitive tree of packages to audit. The
whole framework is roughly **1,900 lines** across **17 ES modules**.

```bash
npm install routiva
```

Requires **Node.js 18 or newer**. No runtime dependencies. No dev dependencies.

> routiva is not trying to replace Express for everyone. It is for the projects
> that want a framework small enough to read end to end, and a dependency graph
> that is exactly `node_modules/routiva`.

## Why another framework?

Express is excellent, mature and battle-tested. But it carries a large transitive
dependency tree and a handful of sharp edges that this project smooths over:

- **Async errors were an afterthought.** In Express 4, a rejected promise in a
  handler hangs the request unless you call `next(err)` yourself. routiva catches
  rejected promises and thrown errors automatically.
- **The framework is spread across packages.** CORS, compression, rate limiting
  and MIME types each live in their own dependency. routiva ships them in the core.
- **HTTP correctness is optional.** Express returns `404` for a path that exists
  with the wrong method. routiva answers `405` with an `Allow` header, and handles
  `OPTIONS` and `HEAD` for you.
- **You cannot read it.** Express is many files of which the interesting logic is
  a fraction. routiva is small enough to understand in an afternoon.

## The mental model

An app is a **router**. A router is an **ordered list of layers**. A layer is
either a route, a piece of middleware, or an error handler. Requests walk the
list top to bottom; the first layer that sends a response ends the journey.

```text
incoming request
      │
      ▼
┌─────────────────────────────────────────────────────┐
│  layer 0   logger()          → logs, calls next()    │
│  layer 1   cors()            → headers, calls next() │
│  layer 2   json()            → parses body, next()   │
│  layer 3   GET /users/:id    → sends a response  ────┼──▶ done
│  layer 4   error handler     → only runs on next(err)│
└─────────────────────────────────────────────────────┘
```

That is the entire design. Once you understand the stack, every other page in
these docs is detail.

## Your first server

Create `server.js`:

```js
import { createApp } from 'routiva';

const app = createApp();

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
```

Run it with `node server.js` (your `package.json` should have
`"type": "module"`), then:

```bash
curl http://localhost:3000/
curl http://localhost:3000/users/42
```

## Where to go next

| If you want to… | Read |
| --- | --- |
| Install it properly and try the bundled demo | [Installation](installation.md) |
| Build a small app step by step | [Quick start](quick-start.md) |
| Understand routes, params and wildcards | [Routing](routing.md) |
| Learn the middleware stack | [Middleware](middleware.md) |
| Look up a method or option | [API reference](api-reference.md) |

## Requirements and compatibility

| Requirement | Detail |
| --- | --- |
| Node.js | 18.0.0 or newer (uses global `fetch` in tests, `node:test`) |
| Module system | ESM. Set `"type": "module"` or use `.mjs` |
| Runtime dependencies | none |
| TypeScript | Ships as plain JavaScript; works with `allowJs` |
