import { Link } from 'react-router-dom';
import { useTheme, ThemeIcons } from '../hooks/useTheme.jsx';
import { useSearch } from '../context/SearchContext.jsx';

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function ThemeButton() {
  const { toggle } = useTheme();
  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle color theme" title="Toggle theme" type="button">
      <ThemeIcons />
    </button>
  );
}

/**
 * The site header. `menu` shows the mobile hamburger; `version` renders the
 * small chip next to the wordmark; children are the right-hand nav links.
 */
export default function Topbar({ menu = false, onToggleMenu, version, children }) {
  const { openSearch } = useSearch();

  return (
    <header className="topbar">
      {menu && (
        <button className="hamburger" onClick={onToggleMenu} aria-label="Open navigation" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      )}
      <Link className="brand" to="/">
        <span className="mark">r</span>
        <span>routiva</span>
        {version && <span className="ver">{version}</span>}
      </Link>
      <div className="spacer" />
      <button className="search-trigger" onClick={openSearch} aria-label="Search documentation" type="button">
        <SearchIcon />
        <span className="label">{menu ? 'Search documentation' : 'Search docs'}</span>
        <span className="kbd">⌘K</span>
      </button>
      <nav className="topbar-links">{children}</nav>
    </header>
  );
}

export { ThemeButton };
