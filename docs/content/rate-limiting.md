---
title: Rate limiting
description: Fixed-window rate limiting keyed by client IP, with X-RateLimit headers, 429 responses and a pluggable store.
section: Built-in middleware
order: 3
---

## What rateLimit() does

`rateLimit()` counts requests per client in a fixed time window and rejects
callers who exceed the limit with a `429`. It sets the standard
`X-RateLimit-*` headers and a `Retry-After` header on the rejection.

```js
import { createApp, rateLimit } from 'routiva';

const app = createApp();

app.use(rateLimit({ windowMs: 60_000, max: 100 }));
```

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `windowMs` | `60000` | Window length in milliseconds |
| `max` | `100` | Maximum requests per window (alias: `limit`) |
| `statusCode` | `429` | Status code of the default rejection |
| `message` | `'Too Many Requests'` | Message in the default JSON rejection |
| `headers` | `true` | Emit `X-RateLimit-*` and `Retry-After` (set `false` to disable) |
| `skip` | `() => false` | `(req, res) => boolean`; return `true` to bypass counting |
| `keyGenerator` | client IP | `(req, res) => string`; the counter key |
| `handler` | `undefined` | `(req, res, next, record) => void` for custom rejections |
| `store` | `new MemoryStore(windowMs)` | Counter backend implementing `hit(key)` |

## The algorithm

The default store uses a **fixed window** per key. Every request increments the
counter; the window resets after `windowMs`.

```text
hit(key)
  │
  ├─ no record, or record.resetTime <= now?
  │      record = { count: 0, resetTime: now + windowMs }
  │
  ├─ record.count += 1
  └─ return { count, resetTime }

limiter(req, res, next)
  │
  ├─ skip(req, res)? ─▶ next()
  ├─ record = store.hit(keyGenerator(req, res))
  ├─ remaining = max(0, max - record.count)
  ├─ over limit? record.count > max
  │      ├─ set Retry-After, call handler(...) or send statusCode JSON
  │      └─ stop
  └─ next()
```

The count is incremented before it is checked, so with `max: 100` the 101st
request in a window receives the `429`. A fixed window is cheap but allows a
burst at a boundary: a client can send `max` requests just before the reset and
another `max` just after. For smooth limits, keep the interface and swap in a
sliding-window `store`.

## Response headers

When `headers` is true (the default), every request through the limiter gets:

| Header | Value |
| --- | --- |
| `X-RateLimit-Limit` | `max` |
| `X-RateLimit-Remaining` | `max(0, max - count)` |
| `X-RateLimit-Reset` | Window reset time in Unix **seconds** (`Math.ceil(resetTime / 1000)`) |
| `Retry-After` | Seconds until reset, at least `1` — only on the `429` response |

Set `headers: false` to suppress all of them, including `Retry-After`.

The default rejection is JSON, using `statusCode` and `message`:

```json
{ "error": { "message": "Too Many Requests", "status": 429 } }
```

## The MemoryStore

`MemoryStore` is a `Map`-backed fixed-window store exported from the package.

```js
import { rateLimit, MemoryStore } from 'routiva';

const store = new MemoryStore(60_000);
app.use(rateLimit({ store }));
```

| Member | Description |
| --- | --- |
| `new MemoryStore(windowMs = 60000)` | Create the store; starts an `unref()`'d cleanup timer |
| `hit(key)` | Increment and return `{ count, resetTime }` (resets expired windows) |
| `reset(key)` | Delete one key; with no argument, clear the whole store |
| `clearExpired()` | Drop every record whose `resetTime` has passed |
| `size` | Number of live keys |
| `stop()` | Stop the background cleanup timer |

The cleanup timer is `unref()`'d, so it never keeps the process alive.

## Custom stores

The middleware only calls one method: `store.hit(key)`, which must return
`{ count, resetTime }` **synchronously**. `reset`, `clearExpired` and `size` are
conveniences on `MemoryStore` — the limiter does not use them.

```js
class RedisStore {
  constructor(windowMs) {
    this.windowMs = windowMs;
  }

  // Must be synchronous: the middleware reads the record on the same tick.
  hit(key) {
    const count = redis.incr(key);           // node_redis in sync-ish wrapper
    if (count === 1) redis.pexpire(key, this.windowMs);
    const ttl = redis.pttl(key);
    return { count, resetTime: Date.now() + ttl };
  }
}
```

Most real backends are async, but `hit` must stay synchronous. Do the async
lookup in an earlier middleware, stash a `{ count, resetTime }` on the request,
and read it back from `key` inside `hit`.

## Per-route limits

A limiter is ordinary middleware, so attach it to one route and clamp sensitive routes harder than the global default.

```js
import { createApp, rateLimit } from 'routiva';

const app = createApp();

const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  message: 'Too many login attempts. Try again later.',
  keyGenerator: (req) => `${req.ip}:${req.body?.email ?? ''}`,
});

app.post('/login', loginLimiter, async (req, res) => {
  // ...
  res.json({ ok: true });
});
```

A custom `handler` takes over the response completely. `record` carries the
current `{ count, resetTime }`:

```js
app.use(
  rateLimit({
    max: 20,
    handler(req, res, next, record) {
      res.status(429).json({
        error: 'rate_limited',
        retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000),
      });
    },
  }),
);
```

To disable limiting during tests, pass `skip`:

```js
app.use(rateLimit({ skip: () => process.env.NODE_ENV === 'test' }));
```

## How keys are chosen

The default `keyGenerator` returns `req.ip`, falling back to
`req.raw.socket.remoteAddress`, then `'unknown'`. `req.ip` respects the app's
`trust proxy` setting: with it off, it is the socket's `remoteAddress`; with it
on, it comes from `X-Forwarded-For` (a number selects that many hops from the
right). Behind a proxy, enable `trust proxy` or every caller shares the proxy's
IP and the limit.

The default store lives in memory, so it counts per process. Multiple instances
behind a load balancer each keep their own counters unless you supply a shared
`store`.
