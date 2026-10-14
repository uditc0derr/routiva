// routiva docs — page behaviour: mobile sidebar, code copy, TOC spy, search.
// Framework-free and dependency-free.

/* --------------------------------------------------------------------------
   Mobile sidebar
   -------------------------------------------------------------------------- */

const menuBtn = document.getElementById('docsMenuBtn');
const sidebar = document.getElementById('docsSidebar');
const scrim = document.getElementById('docsScrim');

function setMenu(open) {
  if (!sidebar || !menuBtn) return;
  sidebar.classList.toggle('open', open);
  if (scrim) scrim.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('docs-menu-open', open);
}

if (menuBtn) {
  menuBtn.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
}
if (scrim) scrim.addEventListener('click', () => setMenu(false));
if (sidebar) {
  sidebar.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

/* --------------------------------------------------------------------------
   Copy buttons on code blocks
   -------------------------------------------------------------------------- */

document.querySelectorAll('.codeblock').forEach((block) => {
  const btn = block.querySelector('.copy-btn');
  const code = block.querySelector('code');
  if (!btn || !code) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      const original = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1400);
    } catch {
      /* clipboard unavailable */
    }
  });
});

/* --------------------------------------------------------------------------
   Table of contents scroll spy
   -------------------------------------------------------------------------- */

const toc = document.getElementById('docsToc');
if (toc) {
  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const targets = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const visible = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      const first = targets.find((t) => visible.has(t.id));
      if (first) {
        links.forEach((a) => a.classList.remove('active'));
        byId.get(first.id)?.classList.add('active');
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
  );
  targets.forEach((t) => observer.observe(t));
}

/* --------------------------------------------------------------------------
   Search (⌘K)
   -------------------------------------------------------------------------- */

const searchOverlay = document.getElementById('docsSearch');
const searchInput = document.getElementById('docsSearchInput');
const searchResults = document.getElementById('docsSearchResults');

let indexPromise = null;
let items = [];
let matches = [];
let activeIndex = 0;

function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch('/search-index.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        items = data;
        return items;
      })
      .catch(() => []);
  }
  return indexPromise;
}

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.hidden = false;
  loadIndex();
  setTimeout(() => searchInput?.focus(), 20);
  if (!searchInput.value) renderResults('');
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.hidden = true;
}

function score(item, q) {
  const title = item.title.toLowerCase();
  const text = item.text.toLowerCase();
  const section = item.section.toLowerCase();
  let s = 0;
  if (title.includes(q)) s += 12;
  if (title.startsWith(q)) s += 8;
  if (section.includes(q)) s += 3;
  if (text.includes(q)) s += 2;
  return s;
}

function renderResults(q) {
  if (!searchResults) return;
  const query = q.trim().toLowerCase();
  if (!query) {
    matches = items.slice(0, 8);
  } else {
    matches = items
      .map((item) => ({ item, s: score(item, query) }))
      .filter((m) => m.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((m) => m.item);
  }

  if (!matches.length) {
    searchResults.innerHTML = '<div class="docs-search-empty">No results</div>';
    return;
  }

  activeIndex = 0;
  searchResults.innerHTML = matches
    .map(
      (item, i) =>
        `<a class="docs-search-result${i === 0 ? ' active' : ''}" href="${item.url}">` +
        `<span class="r-top"><span class="r-title">${escapeText(item.title)}</span>` +
        `<span class="r-section">${escapeText(item.section)}</span></span>` +
        (item.description ? `<span class="r-desc">${escapeText(item.description)}</span>` : '') +
        '</a>',
    )
    .join('');
  scrollActive();
}

function escapeText(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function move(step) {
  if (!matches.length) return;
  activeIndex = (activeIndex + step + matches.length) % matches.length;
  searchResults.querySelectorAll('.docs-search-result').forEach((el, i) => {
    el.classList.toggle('active', i === activeIndex);
  });
  scrollActive();
}

function scrollActive() {
  searchResults?.querySelector('.docs-search-result.active')?.scrollIntoView({ block: 'nearest' });
}

const trigger = document.getElementById('docsSearchTrigger');
trigger?.addEventListener('click', openSearch);
searchOverlay?.addEventListener('click', (e) => {
  if (e.target === searchOverlay) closeSearch();
});

searchInput?.addEventListener('input', (e) => renderResults(e.target.value));
searchInput?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    move(1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    move(-1);
  } else if (e.key === 'Enter') {
    const link = searchResults?.querySelector('.docs-search-result.active');
    if (link) window.location.href = link.getAttribute('href');
  }
});

window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (searchOverlay && !searchOverlay.hidden) closeSearch();
    else openSearch();
  }
  if (e.key === 'Escape' && searchOverlay && !searchOverlay.hidden) closeSearch();
  if (e.key === '/' && !/input|textarea/i.test(document.activeElement?.tagName || '')) {
    e.preventDefault();
    openSearch();
  }
});
