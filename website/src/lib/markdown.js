/**
 * Markdown + syntax-highlighting pipeline.
 *
 * This is the same hand-written pipeline the previous static generator used,
 * so the rendered HTML (classes, heading anchors, tables, code blocks) is
 * identical. Links are rewritten from `*.md` / `*.html` into clean SPA routes.
 */

export const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]),
  );

export const escapeAttr = (str) => escapeHtml(str).replace(/`/g, '&#96;');

export function slugify(str) {
  return String(str)
    .replace(/<[^>]+>/g, '')
    .replace(/`/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-');
}

/** Rewrite a Markdown href into a client-side route path. */
function toRoute(href) {
  if (/^(https?:)?\/\//.test(href) || href.startsWith('#') || href.startsWith('mailto:')) {
    return href;
  }
  const [pathPart, hash = ''] = href.split('#');
  let p = pathPart.replace(/\.md$/, '').replace(/\.html$/, '');
  p = p.replace(/^\.\//, '').replace(/\/$/, '');
  if (p === 'index') p = '';
  if (p && !p.startsWith('/')) p = `/${p}`;
  return p + (hash ? `#${hash}` : '');
}

export function stripTags(html) {
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

/* ---------------------------------------------------- syntax highlighting */

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
export function highlight(code, lang) {
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

/* ------------------------------------------------------------- markdown */

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
      const url = toRoute(href);
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

export function renderMarkdown(md) {
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

export function parseFrontmatter(raw) {
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
