---
title: Body parsing
description: Parse JSON, form, text and raw request bodies into req.body with size limits and content-type gating.
section: Core concepts
order: 5
---

## The four parsers

routiva ships four body parsers, all built on one streaming reader:

- `json()` for `application/json`
- `urlencoded()` for `application/x-www-form-urlencoded`
- `text()` for `text/plain`
- `raw()` for a `Buffer` of anything

Each one writes a parsed value to `req.body` and shares the same size-limit and
error semantics, so you can stack them and let each parser decide whether the
request is its job.

```js
import { App, json, urlencoded, text, raw } from 'routiva';

const app = new App();

app.use(json({ limit: '1mb' }));
app.use(urlencoded({ extended: true }));
app.use(text());
app.use(raw());
```

`App.json()`, `App.urlencoded()`, `App.text()` and `App.raw()` are the same
functions attached to the `App` class.

## How a parser decides to run

Every parser runs the same three checks before touching the stream:

1. **Already parsed?** If `req.body !== undefined`, it calls `next()` without
   reading. This is what makes stacking safe — the first parser that handles the
   request wins and the rest become no-ops.
2. **Is there a body?** A request has one when `transfer-encoding` is present,
   or `content-length` is present and greater than `0`. A plain `GET` is skipped.
3. **Does the content type match?** The request's `content-type` is compared to
   the parser's expected type with a case-insensitive substring match, so
   `application/json; charset=utf-8` matches `application/json`.

If any check fails the parser calls `next()` and leaves `req.body` as
`undefined`.

> Gating is a substring match, not a media-type parse.
> `application/vnd.api+json` does **not** contain the string `application/json`,
> so the default `json()` parser skips it. Pass
> `{ type: 'application/vnd.api+json' }`, or use `text()`/`raw()` for those.

## json()

```js
app.post('/users', json({ limit: '100kb' }), (req, res) => {
  res.status(201).json(req.body);
});
```

| Option | Default | Behaviour |
| --- | --- | --- |
| `limit` | `'1mb'` | Maximum body size; overflow rejects with `413` |
| `type` | `'application/json'` | Content-Type substring to match |
| `strict` | `true` | Body must start with `{` or `[` |
| `reviver` | `undefined` | Passed straight to `JSON.parse` |
| `verify` | `undefined` | Called as `verify(req, res, buffer, 'utf-8')` before parsing |

Behaviour worth knowing:

- An **empty body** sets `req.body = {}` instead of leaving it `undefined`.
- With the default `strict: true`, a bare `42`, `"hello"` or `true` is rejected
  before parsing. Set `strict: false` to accept any valid JSON value.
- **Malformed JSON** rejects with an `HttpError(400)` whose `type` is
  `entity.parse.failed` and whose `body` property holds the raw text.
- **Oversized bodies** reject with an `HttpError(413)` with
  `type: 'entity.too.large'` and the message `Request entity too large`.
- `verify` runs after the strict check and before `JSON.parse`. Because it runs
  inside the read promise, **throwing from `verify` routes into your error
  middleware** — exactly what a webhook signature check needs.

### verify and webhook signatures

`verify` gets the raw buffer, so it can validate a signature over the exact bytes
the client sent, before any JSON transformation:

```js
import { createHmac, timingSafeEqual } from 'node:crypto';
import { HttpError, json } from 'routiva';

app.post('/webhooks/stripe', json({
  verify(req, res, buffer) {
    const expected = createHmac('sha256', SECRET).update(buffer).digest('hex');
    const received = req.header('x-signature') || '';
    const a = Buffer.from(expected);
    const b = Buffer.from(received);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new HttpError(400, 'invalid signature', { type: 'signature.invalid' });
    }
  },
}), (req, res) => {
  res.json({ received: true });
});
```

## urlencoded()

```js
app.use(urlencoded({ extended: true }));
```

| Option | Default | Behaviour |
| --- | --- | --- |
| `limit` | `'100kb'` | Maximum body size |
| `extended` | `false` | Decode bracket notation into nested objects |

`urlencoded()` has no `type` option — it always matches
`application/x-www-form-urlencoded`. The body is read with `URLSearchParams`, so
`+` and percent-escapes are decoded for you.

With the default `extended: false`, keys stay flat and the last value wins:

```text
name=ada&role=admin&role=user    ->    { name: 'ada', role: 'user' }
```

With `extended: true`, bracket notation builds nested objects:

```text
user[name]=ada&user[address][city]=london

->  { user: { name: 'ada', address: { city: 'london' } } }
```

> The extended parser builds **objects only**. Array notation such as
> `tags[]=a&tags[]=b` stores a key literally named `''`, not an array. Send JSON
> when you need arrays.

## text()

```js
app.post('/notes', text({ type: 'text/plain' }), (req, res) => {
  res.json({ length: req.body.length });
});
```

| Option | Default | Behaviour |
| --- | --- | --- |
| `limit` | `'100kb'` | Maximum body size |
| `type` | `'text/plain'` | Content-Type substring to match |
| `encoding` | `'utf8'` | Passed to `buffer.toString(encoding)` |

`req.body` is a string. Pass a broader `type` to accept other text-ish content
types.

## raw()

```js
app.post('/upload', raw({ type: 'application/octet-stream', limit: '5mb' }), (req, res) => {
  res.json({ bytes: req.body.length });
});
```

| Option | Default | Behaviour |
| --- | --- | --- |
| `limit` | `'100kb'` | Maximum body size |
| `type` | unset | When omitted, **every** content type is accepted; when set, it must match |

`req.body` is a `Buffer`. Unlike the other three parsers, `raw()` does not gate
on content type unless you pass `type`, which makes it the catch-all parser to
register last.

## Size limits

Limits are parsed by `parseBytes`, which understands bare numbers and unit
suffixes:

| Value | Bytes |
| --- | --- |
| `1024` | 1,024 |
| `'100kb'` | 102,400 |
| `'1mb'` | 1,048,576 |
| `'2gb'` | 2,147,483,648 |

When the accumulated size exceeds the limit, the reader stops collecting chunks,
**drains** the rest of the stream with `stream.resume()` so the socket stays
writable, and rejects with a `413`. An unparsable limit falls back to that
parser's default.

## What the client sees

Body-parser errors are `HttpError`s, so the default error handler renders them as
JSON:

| Situation | Status | `type` | Default message |
| --- | --- | --- | --- |
| Malformed JSON | `400` | `entity.parse.failed` | the `JSON.parse` error message |
| Non-object/array under `strict` | `400` | `entity.parse.failed` | `JSON body must be an object or array` |
| Body over `limit` | `413` | `entity.too.large` | `Request entity too large` |

Because 4xx errors are exposed (`status < 500`), their message reaches the
client. Override the shape with your own error middleware — see
[Error handling](error-handling.md).
