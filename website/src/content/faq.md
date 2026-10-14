---
title: FAQ & roadmap
description: Production readiness, TypeScript, websockets, uploads, Node versions, framework comparisons, the roadmap and contributing.
section: Guides
order: 5
---

## Is it production-ready?

It is small and tested, and the behaviour it implements is deliberate. It is
also new. The honest position:

- It works. There is a real test suite and a runnable demo app.
- It has not seen years of hostile traffic the way Express has.
- It ships no ecosystem, so anything beyond the built-in middleware is yours to
  write.

It is a good fit for internal services, prototypes, edge and embedded targets,
and any project that values a zero-dependency core. Evaluate it against your own
workload before putting it in front of users; nothing here replaces that
judgement.

## Does it work with TypeScript?

There are no bundled type declarations. routiva ships as plain ESM JavaScript.
You have three options:

1. Set `"allowJs": true` and let TypeScript infer what it can from the source.
2. Write a `.d.ts` file for the surface you use.
3. Write the server in plain JavaScript.

The API is regular: classes, named exports and middleware factories. Nothing
relies on dynamic shapes that resist typing, so hand-written declarations are
straightforward. Bundled types are on the roadmap.

## Does it support WebSockets or HTTP/2?

Not directly. routiva builds on `node:http`, and `app.listen()` returns the
underlying `http.Server`, so you can attach a WebSocket library to its `upgrade`
event. There is no HTTP/2 support and none is planned for the zero-dependency
core.

## Is there a template engine?

No. There is no `res.render()`, no view engine setting and no `app.locals`. You
compose HTML in a function and send it:

```js
app.get('/', (req, res) => {
  res.type('html').send(`<h1>Hello</h1>`);
});
```

Escape any user input you interpolate yourself. If you need a full template
engine, pair routiva with a standalone renderer or choose Express, where
`res.render()` is integrated.

## How do I handle file uploads?

There is no multipart parser. `raw()` gives you the request body as a `Buffer`
and `text()` gives it to you as a string, so a single-part upload can be read
directly:

```js
app.post('/upload', raw({ limit: '5mb' }), (req, res) => {
  res.json({ bytes: req.body.length });
});
```

For `multipart/form-data`, parse the body yourself or run a standalone parsing
step. There is no upload middleware in the box, and adding one would bring in the
kind of dependency routiva avoids. `raw()` still enforces a size `limit`.

## Which Node versions are supported?

Node `18` and newer, matching `"engines": { "node": ">=18" }`. The runtime uses
standard Node modules (`node:http`, `node:fs`, `node:path`, `node:zlib`, and
friends), all present on 18. The test suite relies on global `fetch` and
`node:test`, which are also 18+. There is no build step, so any current LTS or
newer works.

## How is it different from Fastify, Hono or Koa?

| | routiva | Fastify | Hono | Koa |
| --- | --- | --- | --- | --- |
| Runtime dependencies | 0 | some | some | some |
| Target | Node `node:http` | Node | multi-runtime | Node |
| Schema validation | no | built in | no | no |
| TypeScript types | not bundled | yes | yes | community |
| Middleware model | one ordered stack | hooks and plugins | one stack | onion |
| Opinion | Express-like | plugin-first | tiny and portable | minimal |

Koa replaces `req` and `res` with its own context and uses onion middleware.
Fastify adds schemas, plugins and serialization. Hono targets edge runtimes and
other platforms. routiva keeps Express's stack and handler signatures and stops
there.

## How do I report a bug or contribute?

Open an issue or a pull request on GitHub:
[github.com/uditc0derr/routiva](https://github.com/uditc0derr/routiva). A useful
bug report has a minimal reproduction, the Node version and what you expected to
happen. There is no CLA.

## Roadmap

Ideas that fit the architecture without breaking the zero-dependency rule, in no
committed order:

- `res.render()` with a pluggable engine interface.
- A streaming-safe compression path that wraps the socket, not just `res.send`.
- Signed cookies and a lightweight `session()` store.
- A full `app.mount()` with sub-app semantics.
- Bundled TypeScript declarations.
- Coverage reporting in CI.

None of these has a date. If one matters to you, say so in an issue.

## Contributing

- **Repository:** [uditc0derr/routiva](https://github.com/uditc0derr/routiva)
- **Package:** [routiva on npm](https://www.npmjs.com/package/routiva)
- **License:** MIT

Run `npm test` before opening a pull request. Keep the dependency count at zero:
if a Node built-in can do it, use the built-in. Match the existing file layout and
the one-layer-per-handler model. Small, focused changes are easier to review than
broad rewrites.
