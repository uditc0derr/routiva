---
title: Static files
description: Serve a directory with serveStatic, and send individual files with res.sendFile, res.download and res.attachment.
section: Core concepts
order: 6
---

## serveStatic(root, options)

`serveStatic()` is middleware. It resolves each request path inside `root` and,
when it finds a file, streams it with the correct headers. When it doesn't, it
hands control to the next layer.

```js
import { App, serveStatic } from 'routiva';

const app = new App();
app.use(serveStatic('public', { maxAge: '1h' }));
```

`App.serveStatic()` and the `App.static` alias point at the same function.

## Options

| Option | Default | Behaviour |
| --- | --- | --- |
| `fallthrough` | `true` | Misses call `next()`; set `false` to answer missing files with `404` |
| `dotfiles` | `'ignore'` | `'ignore'` skips, `'deny'` returns `403`, `'allow'` serves them |
| `index` | `['index.html']` | Files tried when the path resolves to a directory; `false` disables indexing |
| `extensions` | `[]` | Extensions appended when the exact path is not a file |
| `redirect` | `true` | Redirect directory requests instead of resolving them |
| `maxAge` | `0` | Sets `Cache-Control: public, max-age=…`; `0` emits no cache header |
| `immutable` | `false` | Appends `immutable` to `Cache-Control` when `maxAge` is set |
| `etag` | `true` | Emit a weak `ETag`; `false` disables it |
| `headers` | unset | Object of extra headers set on every response |
| `type` | unset | Overrides the `Content-Type` derived from the file extension |

> `redirect` defaults to `true`, but the current `findFile` never produces a
> redirect target, so a directory with no matching index falls through (or
> `404`s) rather than redirecting. A directory is only served through its
> `index` list.

## What it handles

- **Methods.** Only `GET` and `HEAD`. Every other method calls `next()`
  immediately, so it composes with `POST` routes on the same path.
- **Traversal.** The path is percent-decoded, normalised and joined to `root`,
  then verified to stay inside it. `..%2f..%2fetc%2fpasswd` resolves outside the
  root and is rejected. A NUL byte is rejected too.
- **Dotfiles.** Files or directories whose name starts with `.` follow the
  `dotfiles` policy. `'ignore'` is the safe default.
- **Index files.** A request for a directory walks the `index` list in order and
  serves the first match that is a regular file.
- **Extension fallback.** If the exact path is neither a file nor a directory,
  each entry of `extensions` is tried in order.
- **Fallthrough.** If nothing is found, `next()` runs unless `fallthrough` is
  `false`, in which case the middleware raises `HttpError(404)`.

### Path resolution

`resolveWithin(root, requestPath, dotfiles)` returns an absolute path, `null`
to skip, or `'deny'`:

| Request path | Result |
| --- | --- |
| `/style.css` | `<root>/style.css` |
| `/..%2f..%2fetc%2fpasswd` | `null` (escapes root) |
| `/a/%00b` | `null` (NUL byte) |
| `/.env` with `dotfiles: 'ignore'` | `null` |
| `/.env` with `dotfiles: 'deny'` | `'deny'` → `403` |
| `/.env` with `dotfiles: 'allow'` | `<root>/.env` |

### Index and extension examples

```js
// Serve public/index.html for "/", public/index.htm as a fallback.
app.use(serveStatic('public', { index: ['index.html', 'index.htm'] }));

// Disable directory indexes entirely.
app.use(serveStatic('public', { index: false }));

// GET /about serves public/about.html.
app.use(serveStatic('public', { extensions: ['html'] }));
```

Extension fallback runs only after the exact path and directory index checks
fail, so it never shadows a real file.

## Conditional and range requests

File responses are handled by `send.js`, the same engine `res.sendFile()` uses.
For every file it sets `Last-Modified`, `Accept-Ranges: bytes` and a weak ETag of
the form `W/"<size-hex>-<mtime-hex>"`.

```text
stat file
   │
   ├─ If-None-Match / If-Modified-Since still fresh ─▶ 304 (no body)
   ├─ Range: bytes=a-b ─▶ 206 + Content-Range, stream the slice
   ├─ bad range ─▶ 416 + Content-Range: bytes */size
   └─ else ─▶ 200 + Content-Length, stream the file
```

Matching rules:

- `If-None-Match: *` is always fresh. Otherwise the header is split on commas and
  each tag is compared for exact equality with the ETag. With `etag: false` the
  check is skipped.
- `If-Modified-Since` is compared at whole-second resolution, because HTTP dates
  carry no milliseconds.
- A range request must match `bytes=<start>-<end>` exactly. Multiple ranges in one
  header are not supported — an unrecognised value is treated as no range.

Valid forms:

| Header | Meaning |
| --- | --- |
| `bytes=0-499` | First 500 bytes |
| `bytes=500-` | From byte 500 to the end |
| `bytes=-500` | Last 500 bytes |
| `bytes=0-0` | A single byte |

A suffix of `0`, or a start beyond the file size, is answered with `416`.

## Caching

`maxAge` is parsed by `parseDuration`, which accepts numbers or strings like
`'500ms'`, `'30s'`, `'10m'`, `'1h'`, `'7d'`.

```js
// Hashed assets: cache for a year, safe because the name changes on edit.
// Note the largest duration unit is weeks, so a year is expressed as 365d.
app.use('/assets', serveStatic('public/assets', { maxAge: '365d', immutable: true }));

// HTML: revalidate on every request.
app.use(serveStatic('public', { etag: true, maxAge: 0 }));
```

Only when `maxAge` is greater than zero is `Cache-Control: public, max-age=…`
sent, with `, immutable` appended when requested. With the default `maxAge: 0`
no `Cache-Control` header is written, so clients fall back to the ETag and
`Last-Modified` revalidation above.

## res.sendFile() and res.download()

Single-file responses reuse the same engine:

```js
app.get('/report', (req, res) => {
  res.sendFile('reports/q3.pdf');            // inline
});

app.get('/report/download', (req, res) => {
  res.download('reports/q3.pdf', 'Q3 2026.pdf');
});
```

- `res.sendFile(filePath, options?, callback?)` resolves the path against the
  process working directory and accepts the same `maxAge`, `etag`, `headers` and
  `type` options as `serveStatic()`. It returns a promise; if you pass a
  callback it returns `this`.
- A missing file rejects with `HttpError(404)`, so it flows into your error
  middleware.
- `res.download(filePath, filename?, options?, callback?)` is `sendFile` plus a
  `Content-Disposition: attachment` header. Arguments shift: a function
  `filename` is treated as the callback, and an object `filename` is treated as
  `options`.
- `res.attachment(filename?)` sets `Content-Disposition: attachment` on its own.
  Non-ASCII names get an RFC 5987 `filename*=UTF-8''…` parameter alongside a
  sanitised ASCII `filename`.

## MIME types

`lookupMime(filePath)` maps an extension to a type using a built-in table, and
falls back to `application/octet-stream`. The table covers HTML, text, Markdown,
JSON, JS, CSS, XML, CSV, YAML, the common image and font formats, audio, video,
WASM, PDF, ZIP and gzip.

```js
import { lookupMime } from 'routiva';

lookupMime('app.css');   // 'text/css; charset=utf-8'
lookupMime('photo.webp'); // 'image/webp'
lookupMime('archive.rar'); // 'application/octet-stream'
```

`res.type(value)` uses its own small extension table, so `res.type('html')` works
as shorthand for `text/html; charset=utf-8`.

## Single-page app fallback

Mount the static handler first, then a catch-all route that returns the shell for
any remaining `GET`. Anything the static layer didn't find lands here.

```js
import { App, serveStatic } from 'routiva';

const app = new App();

app.use(serveStatic('dist', {
  index: ['index.html'],
  extensions: ['html'],
}));

// Client-side routes: /settings, /users/42, … all return the SPA shell.
app.get('*', (req, res) => {
  res.sendFile('dist/index.html');
});

app.listen(3000);
```

Because `serveStatic()` falls through by default, real assets like
`/app.abc123.js` are streamed from disk and only the unknown paths reach the
catch-all. If you serve the API from the same app, register those routes before
the catch-all so they match first.
