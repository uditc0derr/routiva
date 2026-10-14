---
title: Logging
description: One log line per request with method, URL, status and duration, and a custom format hook for JSON logs.
section: Built-in middleware
order: 4
---

## What logger() does

`logger()` writes one line per request after the response finishes. The default
line includes the time, method, URL, status code and duration. Pass `format` to
emit your own shape.

```js
import { createApp, logger } from 'routiva';

const app = createApp();

app.use(logger());
```

Register it first so it wraps every request, including ones that end in an error
handler.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `stream` | `process.stdout` | Anything with a `.write(string)` method |
| `format` | `undefined` | `(req, res, ms) => string`; replaces the default line |
| `enabled` | `true` | Set `false` to disable logging entirely |
| `color` | `stream.isTTY` | Colorize the status code; defaults to on for a TTY |

When `format` is `undefined`, the built-in formatter is used. `color` defaults to
`Boolean(stream.isTTY)`, so piping to a file turns color off automatically. Force
it with `color: true` or `color: false`.

## When the line is written

The middleware starts a `process.hrtime.bigint()` timer on entry and registers
`onFinish` on both `finish` and `close` of `res.raw`. Logging happens on
whichever fires first, and a `logged` latch guarantees exactly one line per
request.

Because it runs after the response, `res.statusCode` and the duration are final —
even for responses produced by an error handler downstream. The line is written
with `stream.write(`${line}\n`)`, so a custom `format` should return a string
without a trailing newline.

## The default format

`defaultFormat` produces a single space-separated line:

```text
<ISO timestamp> <METHOD> <URL> <STATUS> <ms>ms
```

with the status colorized when `useColor` is true. The URL is
`req.originalUrl || req.url`, so a mounted router still logs the full path. The
duration is `ms.toFixed(1)`, one decimal place.

```text
2026-10-14T09:31:02.114Z GET /health 200 3.2ms
```

Status colors are chosen by range:

| Status | Color |
| --- | --- |
| `5xx` | red (`31`) |
| `4xx` | yellow (`33`) |
| `3xx` | cyan (`36`) |
| otherwise | green (`32`) |

The escape codes are only emitted when `useColor` is true, so redirected output
stays clean and copy-pasteable.

## Custom format

`format` receives `(req, res, ms)`, where `ms` is a number. Return the line you
want. This JSON example is suitable for production log pipelines:

```js
import { createApp, logger } from 'routiva';

const app = createApp();

app.use(
  logger({
    format: (req, res, ms) =>
      JSON.stringify({
        time: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(ms * 10) / 10,
        ip: req.ip,
      }),
  }),
);
```

Each request writes one compact JSON object:

```text
{"time":"2026-10-14T09:31:02.114Z","method":"POST","url":"/api/orders","status":201,"durationMs":12.4,"ip":"203.0.113.7"}
```

Send logs somewhere other than stdout by passing a writable stream:

```js
import fs from 'node:fs';
import { logger } from 'routiva';

const access = fs.createWriteStream('access.log', { flags: 'a' });

app.use(logger({ stream: access, color: false }));
```

Any object with a `write(string)` method works. A file stream is not a TTY, so
color is already off; `color: false` makes that explicit.

## Turning it off

`enabled: false` makes the middleware a no-op — useful when a test harness or an
outer logger already covers requests.

```js
app.use(logger({ enabled: process.env.NODE_ENV !== 'test' }));
```

Unlike the other built-in middleware, `logger()` never changes the response: it
reads the request and response but sets no headers and writes no body.
