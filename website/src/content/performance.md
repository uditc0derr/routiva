---
title: Performance
description: Why routiva stays fast — compiled routes, a linear dispatch scan, streaming I/O — and how to benchmark your own workload.
section: Guides
order: 3
---

## Fast because it is small

routiva does not quote a throughput number, because a number from one machine
does not transfer to another. It is quick for a concrete reason: it does little
per request. There is no dependency graph to load, no routing table rebuilt on
each call, no body buffered that could be streamed, and no compression performed
unless the client asked for it.

This page describes the cost model so you can reason about your own app, then
shows how to measure it.

## Where the time goes

A request touches four things:

1. **Wrap.** `new Request(raw)` parses the URL, query string and cookies once.
2. **Dispatch.** The layer stack is scanned until a layer matches and responds.
3. **Handler.** Your code runs.
4. **Serialize.** `res.send()` writes headers and a body.

The framework owns steps 1, 2 and 4. Step 2 grows with the number of layers, so
the design keeps that scan cheap and predictable.

## Routes compile once

Patterns become a `RegExp` at registration time, never per request.
`compile(pattern, end)` in `src/router.js`:

```text
/users/:id    ->  /^\/users\/([^/]+)\/?$/    keys: ['id']
/files/*      ->  /^\/files\/(.*)\/?$/       keys: ['wildcard']
/api (mount)  ->  /^\/api(?=\/|$)/           prefix, not anchored to the end
```

Literal segments are regex-escaped, `:name` becomes `([^/]+)` and `*` becomes
`(.*)`. The compiled regex and its `keys` array are stored on the layer and
shared by every request. Dispatch only calls `layer.regex.exec(req.path)`.

## The dispatch loop is a linear scan

All routing runs through one function with a shared cursor:

```js
function dispatch(stack, req, res, done) {
  let index = 0;
  let finished = false;

  function next(err) {
    if (finished) return;
    const wantsError = Boolean(err);

    while (index < stack.length) {
      const layer = stack[index++];
      if (layer.isErrorHandler !== wantsError) continue;
      const match = layer.regex.exec(req.path);
      if (!match) continue;
      // ...method check, then invoke(layer, match, err, req, res, next)
      break;
    }
    // stack exhausted -> done(err)
  }

  next();
}
```

Two properties matter:

- **`next()` is O(1), not recursive.** The cursor never moves backwards, so a
  chain of `next()` calls does not re-scan earlier layers or grow the call stack.
- **Error handlers are skipped for free.** During normal flow, four-arity layers
  are filtered out by a single comparison before the regex is even run.

Cost is linear in the number of layers that precede the match.

## Per-request allocation

The only objects created per request are the two wrappers and the small values
they hold:

- `new Request(raw)` reads `raw.url` with the `URL` constructor once, then splits
  `query` and `cookies` into plain objects.
- `new Response(raw, req)` stores two references and an empty `locals` object.
- During dispatch, `invoke()` merges params into a fresh object and saves the
  previous values so a mounted router can restore them on `next()`.

Nothing clones the stack, and no layer is recompiled.

## Compression costs CPU to save bytes

`compress()` wraps `res.send()` and decides per response:

```text
Accept-Encoding: br, gzip  -> pick br, else gzip, else deflate
body below threshold       -> send as-is
Content-Type not text-ish  -> send as-is
already encoded / streamed -> send as-is
```

The trade is explicit: brotli and gzip burn CPU and latency to shrink a body.
The default `threshold` is `1kb`, so small responses skip the work entirely. A
response the client cannot benefit from (already encoded, an image, a streamed
file) is left alone. If compression shows up in a profile, raise `threshold`,
pin `level`, or gate it with `filter(req, res)`.

Because routiva buffers `res.send()` before compressing, it never wraps a file
stream. That keeps `sendFile` streaming, but large generated bodies are
compressed in memory.

## Static files are cheap when cached

`send.js` stats the file, then:

- sets `ETag` (`W/"size-mtime"`) and `Last-Modified`;
- returns `304` immediately when `If-None-Match` or `If-Modified-Since` says the
  client copy is fresh;
- sets `Cache-Control` from `maxAge` and `immutable` when configured;
- serves a single `Range` as `206` by streaming only that slice.

The `304` path is the win: no body, no read of the file contents. Set a long
`maxAge` for immutable assets and let conditional requests do the rest. The
`stat` call itself is a filesystem hit per request; that is the floor for this
strategy.

## The rate limit store is a Map

`MemoryStore` is a fixed-window counter keyed by IP:

- `hit(key)` is one `Map` lookup and an increment;
- expired keys are swept by an interval timer created with `.unref()`, so the
  timer never keeps the process alive;
- `reset()` clears one key or the whole store.

There is no external store. Run more than one process and each keeps its own
counters, so a shared limit needs a custom `store`.

## sendFile streams

`pipeFile()` uses `createReadStream(path, range).pipe(res.raw)`, so memory stays
flat regardless of file size. `finish` and `error` events resolve a promise, so
the surrounding `await` still sees failures. Byte ranges stream the same way.

## Measuring it

Measure your app on your hardware. `autocannon` and `wrk` are both good:

```bash
npm install -g autocannon

# start your app in another shell
node server.js

# 10 connections for 10 seconds
autocannon -c 10 -d 10 http://127.0.0.1:3000/api/products

# 50 connections, JSON POST bodies
autocannon -c 50 -d 20 -m POST \
  -H "content-type=application/json" \
  -b '{"name":"widget","sku":"W-1","price":1}' \
  http://127.0.0.1:3000/api/products
```

`wrk` in the same shape:

```bash
wrk -t4 -c100 -d30s http://127.0.0.1:3000/health
wrk -t4 -c100 -d30s -s post.lua http://127.0.0.1:3000/api/products
```

Watch the shape, not just requests per second:

| Signal | What it tells you |
| --- | --- |
| requests per second | throughput at a given concurrency |
| latency p99 | tail behaviour under load |
| CPU per request | headroom left for middleware |
| RSS and heap | allocation churn and leaks |

Compare against a real Express build of the same app on the same machine. Both
sit on `node:http` and run your handlers, so the difference comes from the
framework's per-request work, not the socket.

## Practical tips

- **Register cheap middleware first.** Each layer is one regex test; a
  path-mounted middleware costs nothing on other routes.
- **Gate expensive work by path**, not by checking inside a global handler.
- **Set a compression threshold** that matches your typical payload.
- **Give static assets a long `maxAge`** and rely on `ETag` for the rest.
- **Stream large files** with `serveStatic` or `res.sendFile`, not by reading
  them into a Buffer.
- **Measure before optimizing.** Add `logger()` and read the duration field, or
  run `autocannon`. Do not guess.
