import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchIndex } from '../lib/content.js';

const SearchCtx = createContext(null);

function runFilter(index, query) {
  const q = query.trim().toLowerCase();
  if (!q) return index.slice(0, 8);
  const terms = q.split(/\s+/);
  return index
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

function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => runFilter(searchIndex, query), [query]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setCursor(0);
    document.body.style.overflow = 'hidden';
    const id = setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    return () => {
      clearTimeout(id);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  if (!open) return null;

  const go = (hit) => {
    onClose();
    if (hit) navigate(hit.url);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      go(filtered[cursor]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="search-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-modal">
        <div className="search-input-row">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            placeholder="Search the docs…"
            autoComplete="off"
            spellCheck="false"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <span className="kbd">Esc</span>
        </div>
        <div className="search-results">
          {filtered.length === 0 ? (
            <div className="search-empty">No matches. Try “routing”, “cors”, “sendFile”…</div>
          ) : (
            filtered.map((hit, i) => (
              <a
                key={hit.url}
                className={i === cursor ? 'search-hit active' : 'search-hit'}
                href={hit.url}
                onClick={(e) => {
                  e.preventDefault();
                  go(hit);
                }}
              >
                <span className="hit-top">
                  <span className="hit-title">{hit.title}</span>
                  <span className="hit-section">{hit.section}</span>
                </span>
                <span className="hit-desc">{hit.description}</span>
              </a>
            ))
          )}
        </div>
        <div className="search-foot">
          <span>
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> navigate
          </span>
          <span>
            <span className="kbd">↵</span> open
          </span>
          <span>
            <span className="kbd">Esc</span> close
          </span>
        </div>
      </div>
    </div>
  );
}

export function SearchProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ open, openSearch, closeSearch }), [open, openSearch, closeSearch]);

  return (
    <SearchCtx.Provider value={value}>
      {children}
      <SearchOverlay open={open} onClose={closeSearch} />
    </SearchCtx.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchCtx);
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
  return ctx;
}
