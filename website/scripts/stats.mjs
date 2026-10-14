#!/usr/bin/env node
/**
 * Collects project stats (version, source files, LOC, test count) from the
 * repository and writes them to src/generated/stats.json for the landing page.
 * Zero dependencies — Node built-ins only.
 */

import { promises as fs, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE = path.resolve(__dirname, '..');
const ROOT = path.resolve(WEBSITE, '..');
const OUT = path.join(WEBSITE, 'src', 'generated', 'stats.json');

function walk(dir, filter) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, filter));
    else if (filter(full)) out.push(full);
  }
  return out;
}

function projectStats() {
  let sourceFiles = 0;
  let loc = 0;
  try {
    const files = walk(path.join(ROOT, 'src'), (f) => f.endsWith('.js'));
    sourceFiles = files.length;
    for (const f of files) loc += readFileSync(f, 'utf8').split('\n').length;
  } catch {
    /* ignore */
  }

  let tests = 0;
  try {
    const dirs = [path.join(ROOT, 'test'), path.join(ROOT, 'crud-app', 'test')];
    for (const dir of dirs) {
      if (!statSync(dir).isDirectory()) continue;
      for (const f of readdirSync(dir)) {
        if (!f.endsWith('.js')) continue;
        const src = readFileSync(path.join(dir, f), 'utf8');
        const m = src.match(/\b(?:test|it)\(\s*['"`]/g);
        if (m) tests += m.length;
      }
    }
  } catch {
    /* ignore */
  }

  let version = '0.0.0';
  try {
    version = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
  } catch {
    /* ignore */
  }

  return { sourceFiles, loc, tests, version };
}

const stats = projectStats();
await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(stats, null, 2) + '\n');
console.log(
  `stats → src/generated/stats.json  ·  v${stats.version}  ·  ${stats.sourceFiles} files  ·  ` +
    `${(stats.loc / 1000).toFixed(1)}k LOC  ·  ${stats.tests} tests`,
);
