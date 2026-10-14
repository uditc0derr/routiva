import { once } from 'node:events';
import http from 'node:http';

/**
 * Start an app on an ephemeral port and return a helper with its base URL.
 */
export async function start(app) {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  return {
    server,
    url: `http://127.0.0.1:${port}`,
    async close() {
      if (!server.listening) return;
      server.close();
      await once(server, 'close');
    },
  };
}

/**
 * Perform a raw HTTP request without fetch's automatic body decompression.
 * Returns `{ status, headers, body }` where `body` is a Buffer.
 */
export function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      { method: options.method || 'GET', headers: options.headers || {} },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () =>
          resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }),
        );
      },
    );
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

/** Wait a tick so response 'finish' listeners have run. */
export function tick(ms = 25) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
