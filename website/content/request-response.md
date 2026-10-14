---
title: Request & Response
description: Every field and helper on the wrapped req and res objects, from req.accepts() to res.format() and res.sendFile().
section: Core concepts
order: 4
---

## The wrappers

Each request is wrapped once. Node's `IncomingMessage` becomes a `Request` and
its `ServerResponse` becomes a `Response`. Both originals stay reachable, so the
wrapper is a convenience layer rather than a cage:

```js
req.raw;   // the IncomingMessage
res.raw;   // the ServerResponse
```

Anything the wrapper does not cover (`req.raw.setTimeout()`,
`res.raw.writeHead()`, `res.raw.socket`) is one property away. Everything the
wrapper *does* cover is listed below.

## Request

`Request` parses the URL, query string, cookies and client IP in its
constructor, so per-request work happens once, not on every property read.

| Member | Type | Notes |
| --- | --- | --- |
| `raw` | `IncomingMessage` | The underlying stream |
| `app` | `App` | The app handling this request |
| `method` | `string` | `'GET'`, `'POST'`, … |
| `url` | `string` | Current URL, minus any stripped mount prefix |
| `originalUrl` | `string` | The original URL, unchanged |
| `path` | `string` | Pathname only, no query string |
| `search` | `string` | Query string including `?`, or `''` |
| `query` | `object` | Parsed query; repeated keys become arrays |
| `params` | `object` | Route parameters, set during dispatch |
| `body` | `any` | Set by body-parser middleware |
| `cookies` | `object` | Parsed `Cookie` header, `j:` values decoded |
| `headers` | `object` | Lower-cased header map |
| `hostname` | `string` | Host without the port |
| `protocol` | `'http' \| 'https'` | Derived from `secure` |
| `secure` | `boolean` | `X-Forwarded-Proto` or a TLS socket |
| `ip` | `string` | Client IP, honouring `trust proxy` |
| `ips` | `string[]` | Forwarded chain, nearest first |

```js
app.get('/search', (req, res) => {
  res.json({
    path: req.path,                 // '/search'
    q: req.query.q,                 // 'cats'
    tags: req.query.tag,            // ['a', 'b'] for ?tag=a&tag=b
    ip: req.ip,
  });
});
```

### Request methods

| Method | Returns |
| --- | --- |
| `req.header(name)` | The header value (case-insensitive) or `undefined` |
| `req.get(name)` | Alias for `header()` |
| `req.accepts(...types)` | The first accepted type, or `false` |
| `req.is(...types)` | Whether the request `Content-Type` matches |

```js
req.header('user-agent');
req.accepts('json', 'html');   // 'json' | 'html' | false
req.is('json');                // true for application/json
req.is('json', 'text/*');      // true for JSON or any text type
```

`accepts()` with no arguments returns the raw `Accept` header (defaulting to
`*/*`). `is()` accepts shorthand names (`'json'`, `'html'`) and media ranges
such as `'text/*'`.

### Cookies

The `Cookie` header is parsed for you. Values written as `j:` JSON — which is
what `res.cookie()` produces for object values — are decoded back:

```js
app.get('/', (req, res) => {
  const theme = req.cookies.theme;         // string
  const prefs = req.cookies.prefs;         // object, if written as j: JSON
  res.json({ theme, prefs });
});
```

## Response

`Response` makes every mutator return `this`, so calls chain:

```js
res.status(201).type('json').send({ ok: true });
```

| Member | Description |
| --- | --- |
| `res.raw` | The underlying `ServerResponse` |
| `res.req` | The matching `Request` |
| `res.locals` | A per-response object for your own data |
| `res.statusCode` | Get/set the status code |
| `res.headersSent` | `true` once the response has started |
| `res.finished` | `true` once the response has ended |

### Setting headers

```js
res.status(200);
res.set('X-Request-Id', 'abc');           // one header
res.set({ 'Cache-Control': 'no-store' }); // many at once
res.header('X-Other', 'v');               // alias for set()
res.append('Set-Cookie', 'a=1');          // append to a multi-value header
res.get('Content-Type');                  // read one back
res.vary('Accept');                       // add to Vary, de-duplicated
```

`vary()` merges with any existing `Vary` value and ignores duplicates.

### Content type

```js
res.type('json');     // application/json; charset=utf-8
res.type('html');     // text/html; charset=utf-8
res.type('.css');     // text/css; charset=utf-8
res.type('image/png'); // used verbatim when it contains "/"
```

### Sending a body

`res.send()` picks a behaviour from the value it is given:

| Body | Content-Type | Behaviour |
| --- | --- | --- |
| `null` / `undefined` | `text/plain` | Empty body, `Content-Length: 0` |
| `Buffer` | `application/octet-stream` | Raw bytes |
| object / array | `application/json` | Delegates to `res.json()` |
| string / number | `text/html` | Written as UTF-8 |

A `Content-Type` is only set when the response does not already have one.
`res.json(value)` sets `application/json; charset=utf-8` when needed and
serializes with `JSON.stringify`.

```js
res.json({ ok: true });
res.send('<h1>Hello</h1>');
res.send(Buffer.from('bytes'));
res.sendStatus(204);          // status + reason phrase as text
```

### The write-once guard

`res.send()`, `res.json()` and friends check `headersSent || writableEnded`
first. A stray second `res.json()` is silently ignored instead of crashing with
`ERR_HTTP_HEADERS_SENT`:

```js
app.get('/', (req, res) => {
  res.json({ first: true });
  res.json({ second: true });   // no-op
});
```

### Cookies

```js
res.cookie('session', 'abc123', {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60,   // milliseconds
  path: '/',
});

res.clearCookie('session');   // expires it immediately
```

`res.cookie()` merges into any existing `Set-Cookie` header rather than
overwriting it, so several cookies can be set in one response. Supported
options: `path`, `maxAge` (ms), `expires`, `domain`, `secure`, `httpOnly`,
`sameSite` (`true` means `Strict`) and `partitioned`. Object values are stored
as `j:` JSON, which `req.cookies` decodes automatically.

### Redirects and downloads

```js
res.redirect('/login');          // 302
res.redirect(301, '/new');       // explicit status
res.sendStatus(403);             // 403 with the reason phrase as body

res.attachment('report.csv');    // Content-Disposition: attachment
res.sendFile('reports/q3.pdf');  // resolves a path from the cwd
res.download('reports/q3.pdf', 'Q3 2026.pdf');
```

`redirect()` accepts both `(url, status)` and `(status, url)`. `sendFile()` and
`download()` share the static-file engine — see
[Static files](static-files.md) for conditional and range requests.

### Content negotiation

`res.format()` chooses a handler from the client's `Accept` header, sets
`Vary: Accept`, and falls back to `default` or `406`:

```js
app.get('/greet', (req, res) => {
  res.format({
    json: () => res.json({ hello: 'world' }),
    html: () => res.send('<h1>Hello</h1>'),
    default: () => res.status(406).send('Not Acceptable'),
  });
});
```

Keys may be shorthands (`json`, `html`) or full media types. Evaluation uses the
same `req.accepts()` logic as `Request`.

### Low-level writes

When you need the socket directly:

```js
res.write('chunk');
res.end();
res.raw.end(compressedBuffer);
```

`res.write()` and `res.end()` return the underlying write result / `this`
respectively. Prefer `res.send()` unless you are streaming or compressing
manually.

## A worked example

```js
import { createApp, json } from 'routiva';

const app = createApp();
app.use(json());

app.post('/users', (req, res) => {
  const wantsHtml = req.accepts('html') === 'html';

  res.status(201).set('X-Created', 'yes');
  res.cookie('lastUser', { id: 7 }, { httpOnly: true });

  if (wantsHtml) {
    res.type('html').send('<p>Created</p>');
  } else {
    res.json({ created: req.body, id: 7 });
  }
});

app.listen(3000);
```

## Where to go next

| If you want to… | Read |
| --- | --- |
| See the full API surface | [API reference](api-reference.md) |
| Send files and ranges | [Static files](static-files.md) |
| Parse request bodies | [Body parsing](body-parsing.md) |
| Return errors | [Error handling](error-handling.md) |
