import { test } from 'node:test';
import assert from 'node:assert/strict';
import { App, logger } from '../src/index.js';
import { start, tick } from './helpers.js';

function collect() {
  const lines = [];
  return {
    lines,
    stream: {
      isTTY: false,
      write(chunk) {
        lines.push(chunk);
      },
    },
  };
}

test('logger records method, url, status and duration', async (t) => {
  const sink = collect();
  const app = new App();
  app.use(logger({ stream: sink.stream }));
  app.get('/ping', (req, res) => res.json({ pong: true }));

  const s = await start(app);
  t.after(() => s.close());

  await fetch(`${s.url}/ping?x=1`);
  await tick();

  assert.equal(sink.lines.length, 1);
  const line = sink.lines[0];
  assert.match(line, /GET \/ping\?x=1 /);
  assert.match(line, / 200 /);
  assert.match(line, /ms/);
});

test('logger respects a custom format function', async (t) => {
  const sink = collect();
  const app = new App();
  app.use(
    logger({
      stream: sink.stream,
      format: (req, res) => `custom:${req.method}:${res.statusCode}`,
    }),
  );
  app.get('/', (req, res) => res.send('ok'));

  const s = await start(app);
  t.after(() => s.close());

  await fetch(`${s.url}/`);
  await tick();

  assert.equal(sink.lines[0].trim(), 'custom:GET:200');
});
