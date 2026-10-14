import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '127.0.0.1';

const { app } = await createApp();

const server = app.listen(port, host, () => {
  console.log(`\n  CRUD app (routiva) running`);
  console.log(`  → http://${host}:${port}          (browser UI)`);
  console.log(`  → http://${host}:${port}/api/products   (JSON API)\n`);
});

// Graceful shutdown so `Ctrl-C` closes the socket cleanly.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`\nReceived ${signal}, shutting down...`);
    server.close(() => process.exit(0));
  });
}
