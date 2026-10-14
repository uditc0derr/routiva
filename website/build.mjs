#!/usr/bin/env node
/**
 * routiva docs — a zero-dependency static site generator.
 *
 * Reads Markdown from website/content/, renders it with a small hand-written
 * Markdown + syntax-highlighting pipeline, and writes a complete static site to
 * website/dist/ (HTML pages, a search index, sitemap, robots and assets).
 *
 * There are no dependencies: only Node built-ins.
 *
 *   node website/build.mjs           # build once
 *   node website/build.mjs --watch   # rebuild on content/theme changes
 */

import { promises as fs, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(__dirname, 'content');
const THEME_DIR = path.join(__dirname, 'theme');
const ASSETS_DIR = path.join(__dirname, 'assets');
const OUT_DIR = path.join(__dirname, 'dist');

const SITE = {
  name: 'routiva',
  url: 'https://uditc0derr.github.io/routiva/',
  repo: 'https://github.com/uditc0derr/routiva',
  npm: 'https://www.npmjs.com/package/routiva',
  org: 'uditc0derr',
  npm_user: 'uditcoderrr',
};

/** Order of sidebar sections. Pages are grouped and sorted by this list. */
const SECTION_ORDER = [
  'Introduction',
  'Core concepts',
  'Built-in middleware',
  'Guides',
  'Reference',
];

/* ==========================================================================
   Small helpers
   ========================================================================== */

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]),
  );

const escapeAttr = (str) => escapeHtml(str).replace(/`/g, '&#96;');

function slugify(str) {
  return String(str)
    .replace(/<[^>]+>/g, '')
    .replace(/`/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-');
}

function rewriteHref(href) {
  return href.replace(/\.md(?=(#|$))/, '.html');
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ==========================================================================
   Syntax highlighting
   ========================================================================== */

const HL = {
  js: [
    ['com', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
    ['str', /`(?:\\[\s\S]|[^\\`])*`|'(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*"/],
    ['num', /\b0[xX][\da-fA-F]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],
    [
      'kw',
      /\b(?:import|export|from|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|super|this|try|catch|finally|throw|async|await|of|in|typeof|instanceof|delete|void|yield|static|null|undefined|true|false)\b/,
    ],
    ['fn', /\b[A-Za-z_$][\w$]*(?=\s*\()/],
    ['prop', /(?<=\.)[A-Za-z_$][\w$]*/],
  ],
  json: [
    ['str', /"(?:\\.|[^"\\])*"/],
    ['num', /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],
    ['kw', /\b(?:true|false|null)\b/],
  ],
  bash: [
    ['com', /#[^\n]*/],
    ['str', /"(?:\\.|[^"\\])*"|'[^']*'/],
    ['var', /\$\{?[A-Za-z_][\w]*\}?/],
    [
      'kw',
      /\b(?:npm|npx|node|pnpm|yarn|export|if|then|else|elif|fi|for|in|do|done|echo|printf|curl|cd|mkdir|rm|cp|mv|cat|grep|rg|ls|chmod|open|start|set|PORT|HOST|DATA_FILE|NODE_ENV)\b/,
    ],
    ['flag', /-{1,2}[A-Za-z][\w-]*/],
    ['num', /\b\d+(?:\.\d+)?\b/],
  ],
  http: [
    ['method', /\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/],
    ['str', /https?:\/\/[^\s]+/],
    ['attr', /^[A-Za-z][A-Za-z-]*(?=:)/],
    ['num', /\b\d{3}\b/],
  ],
  html: [
    ['com', /<!--[\s\S]*?-->/],
    ['tag', /<\/?[A-Za-z][\w-]*/],
    ['attr', /\b[A-Za-z-]+(?==)/],
    ['str', /"(?:[^"\\]|\\.)*"|'[^']*'/],
    ['punc', /\/?>/],
  ],
  css: [
    ['com', /\/\*[\s\S]*?\*\//],
    ['str', /"(?:[^"\\]|\\.)*"|'[^']*'/],
    ['num', /#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|fr|deg|ch)?\b/],
    ['prop', /[-a-z]+(?=\s*:)/],
  ],
};

const LANG_ALIASES = {
  javascript: 'js',
  mjs: 'js',
  cjs: 'js',
  js: 'js',
  jsonc: 'json',
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  console: 'bash',
  terminal: 'bash',
  html: 'html',
  xml: 'html',
  css: 'css',
  yaml: 'bash',
  yml: 'bash',
  txt: 'text',
  '': 'text',
};

function compileRules(rules) {
  const src = rules.map(([name, re]) => `(?<${name}>${re.source})`).join('|');
  return new RegExp(src, 'gm');
}

const RULE_CACHE = new Map();
function highlight(code, lang) {
  const norm = LANG_ALIASES[lang] !== undefined ? LANG_ALIASES[lang] : lang;
  const rules = HL[norm];
  if (!rules) return escapeHtml(code);
  if (!RULE_CACHE.has(norm)) RULE_CACHE.set(norm, compileRules(rules));
  const re = RULE_CACHE.get(norm);
  re.lastIndex = 0;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) out += escapeHtml(code.slice(last, m.index));
    const name = Object.keys(m.groups).find((k) => m.groups[k] !== undefined);
    out += `<span class="tok-${name}">${escapeHtml(m[0])}</span>`;
    last = re.lastIndex;
    if (re.lastIndex === m.index) re.lastIndex += 1;
  }
  out += escapeHtml(code.slice(last));
  return out;
}

/* ==========================================================================
   Markdown
   ========================================================================== */

const LIST_RE = /^(\s*)([-*+]|\d+\.)\s+(\S.*)$/;

function inline(text) {
  const codes = [];
  let out = escapeHtml(text);

  // inline code -> placeholder so later rules don't touch it
  out = out.replace(/`([^`]+)`/g, (_m, code) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });

  // images
  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+?)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (_m, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy">`,
  );

  // links
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+?)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (_m, label, href) => {
      const url = rewriteHref(href);
      const ext = /^https?:\/\//.test(url);
      const attrs = ext ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${url}"${attrs}>${label}</a>`;
    },
  );

  // bold, italic, strikethrough
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^\w*])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  out = out.replace(/(^|[^\w_])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
  out = out.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // restore code
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i) => `<code>${codes[Number(i)]}</code>`);
  return out;
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

function renderList(lines, start) {
  const base = lines[start].match(LIST_RE);
  const baseIndent = base[1].length;
  const ordered = /^\d/.test(base[2]);
  let html = ordered ? '<ol>' : '<ul>';
  let i = start;

  while (i < lines.length) {
    const m = lines[i].match(LIST_RE);
    if (!m) break;
    const indent = m[1].length;
    if (indent < baseIndent) break;

    if (indent > baseIndent) {
      const nested = renderList(lines, i);
      html += nested.html;
      i = nested.next;
      continue;
    }

    const itemOrdered = /^\d/.test(m[2]);
    if (itemOrdered !== ordered) break;

    let text = m[3];
    i += 1;

    // continuation lines belonging to this item
    while (i < lines.length && /^\s+\S/.test(lines[i]) && !LIST_RE.test(lines[i])) {
      text += ' ' + lines[i].trim();
      i += 1;
    }

    // a nested list that starts on the following line
    let inner = '';
    if (i < lines.length && LIST_RE.test(lines[i])) {
      const nextIndent = lines[i].match(LIST_RE)[1].length;
      if (nextIndent > baseIndent) {
        const nested = renderList(lines, i);
        inner = nested.html;
        i = nested.next;
      }
    }

    html += `<li>${inline(text)}${inner}</li>`;
  }

  html += ordered ? '</ol>' : '</ul>';
  return { html, next: i };
}

function renderMarkdown(md) {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const headings = [];
  const usedIds = new Map();
  let html = '';
  let i = 0;

  const uniqueId = (raw) => {
    const base = slugify(raw) || 'section';
    if (!usedIds.has(base)) {
      usedIds.set(base, 0);
      return base;
    }
    const n = usedIds.get(base) + 1;
    usedIds.set(base, n);
    return `${base}-${n}`;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      i += 1;
      continue;
    }

    // fenced code
    const fence = line.match(/^\s*```\s*([\w-]*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const buf = [];
      i += 1;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      const code = buf.join('\n');
      const label = lang === 'text' ? 'text' : lang;
      html +=
        `<div class="codeblock" data-lang="${escapeAttr(label)}">` +
        `<div class="codeblock-head"><span class="lang">${escapeHtml(label)}</span>` +
        `<button class="copy-btn" data-copy aria-label="Copy code">Copy</button></div>` +
        `<pre><code>${highlight(code, lang)}</code></pre></div>\n`;
      continue;
    }

    // headings
    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      const level = heading[1].length;
      const raw = heading[2];
      const id = uniqueId(raw);
      const text = inline(raw);
      if (level <= 4) headings.push({ level, id, text: stripTags(text) });
      const anchor = `<a class="anchor" href="#${id}" aria-hidden="true">#</a>`;
      html += `<h${level} id="${id}">${text}${anchor}</h${level}>\n`;
      i += 1;
      continue;
    }

    // horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      html += '<hr>\n';
      i += 1;
      continue;
    }

    // blockquote / callout
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      const inner = renderMarkdown(buf.join('\n')).html;
      html += `<blockquote>${inner}</blockquote>\n`;
      continue;
    }

    // table
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i + 1]) &&
      lines[i + 1].includes('-')
    ) {
      const header = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map((c) => {
        if (/^:-+:$/.test(c)) return 'center';
        if (/^-+:$/.test(c)) return 'right';
        return 'left';
      });
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      const style = (n) => (aligns[n] && aligns[n] !== 'left' ? ` style="text-align:${aligns[n]}"` : '');
      let table = '<div class="table-wrap"><table><thead><tr>';
      header.forEach((h, n) => {
        table += `<th${style(n)}>${inline(h)}</th>`;
      });
      table += '</tr></thead><tbody>';
      for (const row of rows) {
        table += '<tr>';
        for (let n = 0; n < header.length; n += 1) {
          table += `<td${style(n)}>${inline(row[n] || '')}</td>`;
        }
        table += '</tr>';
      }
      table += '</tbody></table></div>\n';
      html += table;
      continue;
    }

    // list
    if (LIST_RE.test(line)) {
      const list = renderList(lines, i);
      html += list.html + '\n';
      i = list.next;
      continue;
    }

    // paragraph — collect until a blank line or a block starter
    const para = [line];
    i += 1;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^\s*```/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !LIST_RE.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    html += `<p>${inline(para.join(' '))}</p>\n`;
  }

  return { html, headings };
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) value = value.slice(1, -1);
    data[m[1]] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

/* ==========================================================================
   Project stats (for the landing page)
   ========================================================================== */

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

/* ==========================================================================
   Templates
   ========================================================================== */

function renderTemplate(tpl, tokens) {
  return tpl.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(tokens, key) ? tokens[key] : match,
  );
}

function buildSidebar(pages, activeSlug) {
  let html = '';
  for (const section of SECTION_ORDER) {
    const group = pages.filter((p) => p.section === section);
    if (!group.length) continue;
    html += '<div class="nav-section">';
    html += `<div class="nav-label">${escapeHtml(section)}</div>`;
    for (const page of group) {
      const active = page.slug === activeSlug ? ' active' : '';
      html += `<a class="nav-link${active}" href="${page.slug}.html">${escapeHtml(page.title)}</a>`;
    }
    html += '</div>';
  }
  return html;
}

function buildToc(headings) {
  const items = headings.filter((h) => h.level === 2 || h.level === 3);
  if (!items.length) return '';
  let html = '<div class="toc-label">On this page</div>';
  for (const h of items) {
    const cls = h.level === 3 ? ' class="h3"' : '';
    html += `<a${cls} href="#${h.id}">${escapeHtml(h.text)}</a>`;
  }
  return html;
}

function buildPager(pages, index) {
  const prev = pages[index - 1];
  const next = pages[index + 1];
  const link = (page, dir) => {
    if (!page) return '<span class="spacer"></span>';
    const label = dir === 'next' ? 'Next' : 'Previous';
    const cls = dir === 'next' ? 'next' : '';
    return (
      `<a class="${cls}" href="${page.slug}.html"><span class="dir">${label}</span>` +
      `<span class="t">${escapeHtml(page.title)}</span></a>`
    );
  };
  return `<nav class="pager">${link(prev, 'prev')}${link(next, 'next')}</nav>`;
}

/* ==========================================================================
   Build
   ========================================================================== */

async function loadPages() {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'));
  const pages = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, '');
    const cleaned = body.replace(/^\s*#\s+.*\n/, ''); // drop a leading H1 (title lives in the header)
    const { html, headings } = renderMarkdown(cleaned);
    const text = stripTags(html).slice(0, 6000);

    pages.push({
      slug,
      title: data.title || slug,
      description: data.description || '',
      section: data.section || 'Reference',
      order: Number(data.order || 0),
      html,
      headings,
      text,
    });
  }

  const sectionIndex = (name) => {
    const idx = SECTION_ORDER.indexOf(name);
    return idx === -1 ? SECTION_ORDER.length : idx;
  };

  pages.sort((a, b) => {
    const s = sectionIndex(a.section) - sectionIndex(b.section);
    if (s !== 0) return s;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  return pages;
}

async function copyAssets() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const file of await fs.readdir(ASSETS_DIR)) {
    await fs.copyFile(path.join(ASSETS_DIR, file), path.join(OUT_DIR, file));
  }
}

async function build() {
  const started = Date.now();
  const pages = await loadPages();
  const stats = projectStats();
  const layout = await fs.readFile(path.join(THEME_DIR, 'layout.html'), 'utf8');
  const landingTpl = await fs.readFile(path.join(THEME_DIR, 'landing.html'), 'utf8');

  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await copyAssets();

  // docs pages
  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const tokens = {
      TITLE: escapeHtml(page.title),
      DESCRIPTION: escapeAttr(page.description),
      SECTION: escapeHtml(page.section),
      PAGE_TITLE: escapeHtml(page.title),
      CONTENT: page.html,
      SIDEBAR: buildSidebar(pages, page.slug),
      TOC: buildToc(page.headings),
      PAGER: buildPager(pages, index),
    };
    const out = renderTemplate(layout, tokens);
    await fs.writeFile(path.join(OUT_DIR, `${page.slug}.html`), out);
  }

  // landing page
  const landing = renderTemplate(landingTpl, {
    VERSION: stats.version,
    TESTS: String(stats.tests),
    YEAR: String(new Date().getFullYear()),
    CODE_QUICKSTART: highlight(QUICKSTART_JS, 'js'),
    CODE_MIDDLEWARE: highlight(MIDDLEWARE_JS, 'js'),
  });
  await fs.writeFile(path.join(OUT_DIR, 'index.html'), landing);

  // 404
  const notFound = renderTemplate(layout, {
    TITLE: 'Page not found',
    DESCRIPTION: 'The page you were looking for does not exist.',
    SECTION: '404',
    PAGE_TITLE: 'Page not found',
    CONTENT:
      '<p>That page does not exist. Try the <a href="index.html">home page</a> or ' +
      '<a href="getting-started.html">getting started</a>, or press ' +
      '<code>⌘K</code> to search the docs.</p>',
    SIDEBAR: buildSidebar(pages, ''),
    TOC: '',
    PAGER: '',
  });
  await fs.writeFile(path.join(OUT_DIR, '404.html'), notFound);

  // search index
  const searchIndex = pages.map((page) => ({
    title: page.title,
    section: page.section,
    description: page.description,
    url: `${page.slug}.html`,
    text: page.text,
  }));
  searchIndex.unshift({
    title: 'Home',
    section: 'Overview',
    description: 'A zero-dependency Express.js alternative for Node.js.',
    url: 'index.html',
    text: 'routiva zero dependency express alternative node.js routing middleware body parsing static files cors compression rate limiting',
  });
  await fs.writeFile(path.join(OUT_DIR, 'search-index.json'), JSON.stringify(searchIndex));

  // sitemap + robots
  const urls = ['', ...pages.map((p) => `${p.slug}.html`)];
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${SITE.url}${u}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  await fs.writeFile(path.join(OUT_DIR, 'sitemap.xml'), sitemap);
  await fs.writeFile(
    path.join(OUT_DIR, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE.url}sitemap.xml\n`,
  );
  await fs.writeFile(path.join(OUT_DIR, '.nojekyll'), '');

  const ms = Date.now() - started;
  console.log(
    `routiva docs → ${path.relative(ROOT, OUT_DIR)}/  ·  ${pages.length} pages  ·  ` +
      `${stats.tests} tests  ·  ${(stats.loc / 1000).toFixed(1)}k LOC  ·  ${ms}ms`,
  );
}

/* ==========================================================================
   Landing-page code samples
   ========================================================================== */

const QUICKSTART_JS = `import { createApp, json, logger } from 'routiva';

const app = createApp();

app.use(logger());
app.use(json());

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, query: req.query });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.listen(3000, () => console.log('http://localhost:3000'));`;

const MIDDLEWARE_JS = `import { createApp, cors, compress, rateLimit } from 'routiva';

const app = createApp();

app.use(cors({ origin: 'https://example.com', credentials: true }));
app.use(compress({ threshold: '1kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// async errors flow into your error middleware automatically
app.get('/report', async (req, res) => {
  const data = await loadReport();   // a rejection becomes a 500
  res.json(data);
});

// 405 + Allow, HEAD and OPTIONS are handled for you
app.get('/health', (req, res) => res.send('ok'));`;

/* ==========================================================================
   Entry
   ========================================================================== */

const watch = process.argv.includes('--watch');
build().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

if (watch) {
  const { watch: fsWatch } = await import('node:fs');
  let timer = null;
  const rerun = () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((err) => console.error(err)), 80);
  };
  fsWatch(CONTENT_DIR, rerun);
  fsWatch(THEME_DIR, rerun);
  fsWatch(ASSETS_DIR, rerun);
  console.log('watching content/, theme/ and assets/ for changes…');
}
