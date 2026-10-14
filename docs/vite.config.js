import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

// Every generated page (plus index.html and 404.html) is an entry. Pages are
// produced by `node build.mjs`, which runs before Vite via the npm pre-scripts.
const pages = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => entry.name);

const input = Object.fromEntries(
  pages.map((name) => [name.replace(/\.html$/, ''), resolve(root, name)]),
);

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input },
  },
});
