---
title: CORS
description: Cross-origin headers, automatic preflight handling and an allow-list origin function for production.
section: Built-in middleware
order: 1
---

## What cors() does

`cors()` sets the `Access-Control-*` headers a browser needs for a cross-origin
request, and answers `OPTIONS` preflight requests for you.

```js
import { createApp, cors } from 'routiva';

const app = createApp();

app.use(cors({ origin: 'https://example.com', credentials: true }));
```

Register it once, before your routes, and it runs on every request that reaches
it. It never ends the request except during a preflight.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `origin` | `'*'` | Allowed origin: string, array, `true` (reflect), `'*'`, or a function |
| `methods` | `'GET,HEAD,PUT,PATCH,POST,DELETE'` | Value for `Access-Control-Allow-Methods` |
| `credentials` | `false` | Also send `Access-Control-Allow-Credentials: true` |
| `preflightContinue` | `false` | Call `next()` after a preflight instead of responding |
| `optionsSuccessStatus` | `204` | Status code used for the automatic preflight response |
| `maxAge` | `undefined` | `Access-Control-Max-Age` in seconds; header is omitted when unset |
| `allowedHeaders` | reflect request | Value for `Access-Control-Allow-Headers` |
| `exposedHeaders` | `undefined` | Value for `Access-Control-Expose-Headers` |

`methods`, `allowedHeaders` and `exposedHeaders` accept either a string or an
array. Arrays are joined with `,` (no space) when written to the header.

### Resolving origin

`origin` accepts several shapes. The resolution lives in `resolveOrigin`:

| `origin` value | Behaviour |
| --- | --- |
| `'*'` (default) | Sends `*`, unless `credentials` is true — then it reflects the request `Origin` |
| `true` | Reflects the request `Origin` (falls back to `*` when the request has none) |
| `'https://example.com'` | Sends that exact string for every request |
| `['https://a.com', 'https://b.com']` | Reflects the request `Origin` only when it is in the array |
| `(origin, req) => string \| false` | Return value is used verbatim; `false` (or empty) sets no CORS headers |

The request origin comes from the `Origin` header. When an array value does not
contain it, or a function returns `false`, the middleware sets no CORS headers at
all and simply calls `next()`.

> A literal `Access-Control-Allow-Origin: *` is invalid together with
> `Access-Control-Allow-Credentials: true`. routiva handles this for you: with the
> default `'*'` and `credentials: true`, it reflects the request `Origin` instead.

## Which headers are set

For any non-preflight request where an origin resolves to a truthy value:

- `Access-Control-Allow-Origin` — the resolved origin.
- `Vary: Origin` — **only** when the resolved origin is not `*`.
- `Access-Control-Allow-Credentials: true` — when `credentials` is set.
- `Access-Control-Expose-Headers` — when `exposedHeaders` is set.

For `OPTIONS` requests, additionally:

- `Access-Control-Allow-Methods` — always, from `methods`.
- `Access-Control-Allow-Headers` — only when `allowedHeaders` is set, or the
  request already sent `Access-Control-Request-Headers` (which is echoed).
- `Access-Control-Max-Age` — only when `maxAge != null`.

Then control continues to `next()`.

## How preflight is answered

An `OPTIONS` request is treated as a preflight whenever it reaches the
middleware. The flow is:

```text
OPTIONS /api/items
  │
  ├─ resolve origin from `Origin`
  ├─ set ACAO / Vary / credentials / expose headers
  ├─ set Access-Control-Allow-Methods
  ├─ echo Access-Control-Request-Headers (or use allowedHeaders)
  ├─ set Access-Control-Max-Age (when maxAge is set)
  │
  └─ preflightContinue?
        ├─ true  → next()   (headers stay set; your route owns the response)
        └─ false → 204 (optionsSuccessStatus) + empty body
```

With the default `preflightContinue: false`, the middleware ends the request with
`res.status(optionsSuccessStatus).send()` — a `204` with `Content-Length: 0`.
Set `preflightContinue: true` when you want a route or another middleware to
produce the `OPTIONS` response; the CORS headers are already on the response by
then.

Because `cors()` answers `OPTIONS` itself, it takes precedence over routiva's
built-in automatic `OPTIONS` handling.

## A production allow-list

Use a function to enforce an allow-list and reflect only the origins you trust.
Mixing `credentials: true` with a reflected origin is the correct combination.

```js
import { createApp, cors } from 'routiva';

const ALLOWED = new Set([
  'https://app.example.com',
  'https://admin.example.com',
]);

const app = createApp();

app.use(
  cors({
    origin(origin, req) {
      // No Origin header: not a browser cross-origin request.
      if (!origin) return false;
      return ALLOWED.has(origin) ? origin : false;
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400,
  }),
);
```

Returning the request origin (instead of `'*'`) is what lets cookies flow.
Returning `false` for an unknown origin leaves the response without CORS headers,
so the browser blocks the call.

## Caching and Vary

`Vary: Origin` is added whenever the resolved origin is not `*`, so shared caches
key on the request `Origin` and do not serve one caller's allow-header to
another. For a static `'*'` origin with no credentials, the header is omitted and
the response is safe to share.

If you serve different origins from the same route, always use a string,
function or array — never a bare `'*'` combined with credentials.
