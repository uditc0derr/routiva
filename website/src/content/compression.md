---
title: Compression
description: gzip, deflate and brotli compression for buffered responses with a size threshold and content-type filter.
section: Built-in middleware
order: 2
---

## What compress() does

`compress()` wraps `res.send()` and, when the client asks for it, compresses the
fully buffered response with `node:zlib`. It handles the negotiation headers and
sets `Content-Encoding`, `Content-Length` and `Vary` for you.

```js
import { createApp, compress, serveStatic } from 'routiva';

const app = createApp();

app.use(compress({ threshold: '1kb' }));
app.use(serveStatic('public'));
```

Register it early, before the routes or middleware that build responses, so
`res.send` is wrapped in time.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `threshold` | `'1kb'` | Minimum body size to compress; number or string (`'1kb'`, `'100kb'`) |
| `filter` | `() => true` | `(req, res) => boolean`; return `false` to skip this request |
| `level` | `undefined` | zlib compression level, passed to gzip and deflate only |

`threshold` is parsed with `parseBytes`, so `'1kb'` means 1024 bytes. Bodies whose
length is **less than** the threshold are sent uncompressed; a body exactly at
the threshold is compressed. `filter` runs once per request, before any response
body exists.

> `level` is applied to gzip and deflate. Brotli is called with `{}` and ignores
> it, so `compress({ level: 9 })` has no effect when the chosen encoding is `br`.

## Choosing an encoding

The encoding is picked from the `Accept-Encoding` request header in a fixed
preference order. Quality values (`q=`) are not parsed — the first token that
matches wins.

| `Accept-Encoding` contains | Chosen encoding |
| --- | --- |
| `br` | `br` (brotli) |
| `gzip` (and no `br`) | `gzip` |
| `deflate` (and no `br`/`gzip`) | `deflate` |
| `*` (none of the above) | `gzip` |
| nothing usable (`identity`, empty, absent) | none — response is sent as-is |

The match is on whole tokens, via a word-boundary regex, so `x-gzip` does not
trigger gzip.

## What gets compressed

The middleware only touches responses that pass every one of these checks:

- The request method is not `HEAD`. `HEAD` is skipped at the top of the
  middleware.
- `filter(req, res)` returns truthy.
- An encoding was selected from `Accept-Encoding`.
- The response has not already started (`headersSent` is false).
- The response has no `Content-Encoding` yet, and its `Cache-Control` does not
  contain `no-transform`.
- The body is a `string`, `number` or `Buffer`. `null`, `undefined` and plain
  objects are passed straight through (`objects` delegate to `res.json`).
- If a `Content-Type` is set, it matches the compressible list below.
- The buffered body is at least `threshold` bytes.

All types in this list are compressed:

| Type | Example |
| --- | --- |
| `text/*` | `text/html`, `text/plain`, `text/css` |
| `application/json` | JSON responses |
| `application/javascript` | `res.type('js')` |
| `application/xml` | XML |
| `application/xhtml+xml` | XHTML |
| `application/manifest+json` | Web app manifests |
| `image/svg+xml` | SVG |

`image/png`, `application/octet-stream` and anything else are left untouched.
Note that `res.send()` always assigns a `Content-Type` (defaulting to
`text/html`), so in practice most responses have a type to test.

## Buffered only

Compression happens inside a wrapped `res.send`, after the body has been built.
That makes it a good fit for `res.json()`, `res.send(string)` and buffers — and
the wrong tool for streams.

- `res.sendFile()` and `serveStatic()` stream from disk. They never call
  `res.send`, so those responses pass through uncompressed and keep streaming.
- `res.end(chunk)` / `res.write(chunk)` called directly are not compressed.
- `res.send()` on a `Buffer` is compressed if its `Content-Type` is compressible.

When compression does run, routiva sets `Content-Encoding`, sets `Content-Length`
to the compressed size, adds `Vary: Accept-Encoding`, and writes the compressed
bytes straight to `res.raw.end()`.

> `Vary: Accept-Encoding` is only added when a response is actually compressed.
> Responses that skip compression do not get it.

## Examples

Compress everything that is at least 1kb, and skip small health checks:

```js
app.use(
  compress({
    threshold: '1kb',
    filter: (req, res) => req.path !== '/health',
  }),
);
```

Compress only JSON and text, with a lower threshold:

```js
app.use(
  compress({
    threshold: 512,
    level: 6,
    filter: (req, res) => req.is('json', 'text/*'),
  }),
);
```

A request that compresses, end to end:

```http
GET /report HTTP/1.1
Accept-Encoding: gzip, deflate, br
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Encoding: br
Content-Length: 1043
Vary: Accept-Encoding
```

Because the `Content-Length` now describes the compressed bytes, clients must
decompress before reading the body. Node's `fetch` and most HTTP clients do this
automatically. To inspect raw bytes in a test, use the low-level `http` module,
which leaves the body compressed.
