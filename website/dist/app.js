/* routiva docs — client behaviour (theme, nav, search, code copy, TOC) */
(() => {
  'use strict';

  const root = document.documentElement;

  /* ------------------------------------------------------------- theme */
  const THEME_KEY = 'routiva-theme';
  const stored = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  })();
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  } else {
    root.setAttribute('data-theme', 'dark');
  }

  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
    });
  }

  /* -------------------------------------------------------- mobile nav */
  const sidebar = document.querySelector('.sidebar');
  const scrim = document.querySelector('.scrim');
  const burger = document.querySelector('[data-menu-toggle]');
  const closeNav = () => {
    sidebar && sidebar.classList.remove('open');
    scrim && scrim.classList.remove('open');
  };
  if (burger && sidebar) {
    burger.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      if (scrim) scrim.classList.toggle('open', open);
    });
  }
  if (scrim) scrim.addEventListener('click', closeNav);

  /* ------------------------------------------------------ copy buttons */
  const copyText = async (text, btn) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    const original = btn.dataset.label || btn.textContent;
    btn.dataset.label = original;
    btn.textContent = 'Copied';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1400);
  };

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-copy]');
    if (!btn) return;
    event.preventDefault();
    let text = btn.getAttribute('data-copy');
    if (!text) {
      const block = btn.closest('.codeblock');
      const code = block && block.querySelector('pre code');
      text = code ? code.textContent : '';
    }
    copyText(text.trim(), btn);
  });

  /* ------------------------------------------------------------- search */
  const overlay = document.querySelector('.search-overlay');
  const input = document.querySelector('#search-input');
  const results = document.querySelector('.search-results');
  const triggers = document.querySelectorAll('[data-search-open]');
  let index = [];
  let filtered = [];
  let cursor = 0;

  const loadIndex = async () => {
    if (index.length) return index;
    try {
      const res = await fetch('search-index.json', { cache: 'force-cache' });
      index = await res.json();
    } catch {
      index = [];
    }
    return index;
  };

  const renderResults = () => {
    if (!results) return;
    if (!filtered.length) {
      results.innerHTML = '<div class="search-empty">No matches. Try “routing”, “cors”, “sendFile”…</div>';
      return;
    }
    results.innerHTML = filtered
      .map(
        (hit, i) =>
          `<a class="search-hit${i === cursor ? ' active' : ''}" href="${hit.url}">` +
          `<span class="hit-top"><span class="hit-title">${escapeHtml(hit.title)}</span>` +
          `<span class="hit-section">${escapeHtml(hit.section)}</span></span>` +
          `<span class="hit-desc">${escapeHtml(hit.description)}</span></a>`,
      )
      .join('');
  };

  const runSearch = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      filtered = index.slice(0, 8);
    } else {
      const terms = q.split(/\s+/);
      filtered = index
        .map((page) => {
          const hay = `${page.title} ${page.section} ${page.description} ${page.text}`.toLowerCase();
          let score = 0;
          for (const term of terms) {
            if (!hay.includes(term)) return null;
            if (page.title.toLowerCase().includes(term)) score += 6;
            if (page.description.toLowerCase().includes(term)) score += 3;
            score += 1;
          }
          return { page, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map((entry) => entry.page);
    }
    cursor = 0;
    renderResults();
  };

  const openSearch = async () => {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    await loadIndex();
    runSearch(input ? input.value : '');
    if (input) {
      input.value = '';
      input.focus();
      runSearch('');
    }
  };

  const closeSearch = () => {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  triggers.forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  }));

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });
  }

  if (input) {
    input.addEventListener('input', () => runSearch(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        cursor = Math.min(cursor + 1, filtered.length - 1);
        renderResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        cursor = Math.max(cursor - 1, 0);
        renderResults();
      } else if (e.key === 'Enter') {
        if (filtered[cursor]) window.location.href = filtered[cursor].url;
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    const isTyping = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay && overlay.classList.contains('open') ? closeSearch() : openSearch();
      return;
    }
    if (e.key === '/' && !isTyping) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  /* ---------------------------------------------------------------- TOC */
  const tocLinks = Array.from(document.querySelectorAll('.toc a'));
  if (tocLinks.length) {
    const map = new Map();
    tocLinks.forEach((link) => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const heading = document.getElementById(id);
      if (heading) map.set(heading, link);
    });
    const setActive = (heading) => {
      tocLinks.forEach((l) => l.classList.remove('active'));
      const link = map.get(heading);
      if (link) link.classList.add('active');
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target);
      },
      { rootMargin: '-84px 0px -70% 0px', threshold: 0 },
    );
    map.forEach((_link, heading) => observer.observe(heading));
  }

  /* ------------------------------------------------------------ helpers */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[ch]);
  }
})();
