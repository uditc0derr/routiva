#!/usr/bin/env node
/**
 * routiva docs (Vite) — page generator.
 *
 * Turns the Markdown in docs/content/ into standalone HTML pages that Vite
 * builds as a multi-page site. There are no dependencies: only Node built-ins,
 * reusing a small hand-written Markdown + syntax-highlighting pipeline.
 *
 *   node docs/build.mjs           # generate pages once
 *
 * The generated pages are picked up by docs/vite.config.js (multi-page input).
 * `npm run dev` / `npm run build` regenerate automatically via pre-scripts.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, 'content');
const THEME_DIR = path.join(__dirname, 'theme');
const OUT_DIR = __dirname; // pages live next to index.html
const PUBLIC_DIR = path.join(__dirname, 'public');

const SITE = {
  repo: 'https://github.com/uditc0derr/routiva',
  npm: 'https://www.npmjs.com/package/routiva',
  license: 'https://github.com/uditc0derr/routiva/blob/main/LICENSE',
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

  out = out.replace(/`([^`]+)`/g, (_m, code) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });

  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+?)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (_m, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy">`,
  );

  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+?)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (_m, label, href) => {
      const url = rewriteHref(href);
      const ext = /^https?:\/\//.test(url);
      const attrs = ext ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${url}"${attrs}>${label}</a>`;
    },
  );

  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^\w*])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  out = out.replace(/(^|[^\w_])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
  out = out.replace(/~~([^~]+)~~/g, '<del>$1</del>');

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

    while (i < lines.length && /^\s+\S/.test(lines[i]) && !LIST_RE.test(lines[i])) {
      text += ' ' + lines[i].trim();
      i += 1;
    }

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

    const fence = line.match(/^\s*```\s*([\w-]*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const buf = [];
      i += 1;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      const code = buf.join('\n');
      const label = lang === 'text' ? 'text' : lang;
      html +=
        `<div class="codeblock" data-lang="${escapeAttr(label)}">` +
        `<div class="codeblock-head"><span class="lang">${escapeHtml(label)}</span>` +
        `<button class="copy-btn" data-copy aria-label="Copy code">Copy</button></div>` +
        `<pre><code>${highlight(code, lang)}</code></pre></div>\n`;
      continue;
    }

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

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      html += '<hr>\n';
      i += 1;
      continue;
    }

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

    if (LIST_RE.test(line)) {
      const list = renderList(lines, i);
      html += list.html + '\n';
      i = list.next;
      continue;
    }

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
    html += '<div class="docs-nav-section">';
    html += `<div class="docs-nav-label">${escapeHtml(section)}</div>`;
    for (const page of group) {
      const active = page.slug === activeSlug ? ' active' : '';
      html += `<a class="docs-nav-link${active}" href="${page.slug}.html">${escapeHtml(page.title)}</a>`;
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
    const cleaned = body.replace(/^\s*#\s+.*\n/, '');
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

async function ensureFavicon() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  const dest = path.join(PUBLIC_DIR, 'favicon.svg');
  try {
    await fs.access(dest);
    return;
  } catch {
    /* not present — fall back to the generator site's icon if available */
  }
  const candidates = [path.join(__dirname, '..', 'website', 'assets', 'favicon.svg')];
  for (const src of candidates) {
    try {
      await fs.copyFile(src, dest);
      return;
    } catch {
      /* try next */
    }
  }
  // last resort: inline a simple mark
  await fs.writeFile(
    dest,
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#4d7cff"/><text x="32" y="44" font-family="Inter,sans-serif" font-size="38" font-weight="700" fill="#fff" text-anchor="middle">r</text></svg>\n',
  );
}

async function build() {
  const started = Date.now();
  const pages = await loadPages();
  const layout = await fs.readFile(path.join(THEME_DIR, 'layout.html'), 'utf8');

  const baseTokens = {
    REPO: SITE.repo,
    NPM: SITE.npm,
    LICENSE: SITE.license,
  };

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const lede = page.description
      ? `<p class="docs-lede">${escapeHtml(page.description)}</p>`
      : '';
    const out = renderTemplate(layout, {
      ...baseTokens,
      TITLE: escapeHtml(page.title),
      DESCRIPTION: escapeAttr(page.description),
      SECTION: escapeHtml(page.section),
      PAGE_TITLE: escapeHtml(page.title),
      LEDE: lede,
      CONTENT: page.html,
      SIDEBAR: buildSidebar(pages, page.slug),
      TOC: buildToc(page.headings),
      PAGER: buildPager(pages, index),
    });
    await fs.writeFile(path.join(OUT_DIR, `${page.slug}.html`), out);
  }

  // 404
  const notFound = renderTemplate(layout, {
    ...baseTokens,
    TITLE: 'Page not found',
    DESCRIPTION: 'The page you were looking for does not exist.',
    SECTION: '404',
    PAGE_TITLE: 'Page not found',
    LEDE: '<p class="docs-lede">That page does not exist. Try the <a href="/">home page</a> or <a href="getting-started.html">getting started</a>.</p>',
    CONTENT:
      '<p>Use the sidebar to browse the documentation, or press <code>⌘K</code> to search.</p>',
    SIDEBAR: buildSidebar(pages, ''),
    TOC: '',
    PAGER: '',
  });
  await fs.writeFile(path.join(OUT_DIR, '404.html'), notFound);

  // search index (served from / by Vite via public/)
  await ensureFavicon();
  const searchIndex = pages.map((page) => ({
    title: page.title,
    section: page.section,
    description: page.description,
    url: `${page.slug}.html`,
    text: page.text,
  }));
  await fs.writeFile(
    path.join(PUBLIC_DIR, 'search-index.json'),
    JSON.stringify(searchIndex),
  );

  const ms = Date.now() - started;
  console.log(`routiva docs → ${pages.length} pages generated  ·  ${ms}ms`);
}

build().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
