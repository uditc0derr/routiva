import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Topbar, { ThemeButton } from './Topbar.jsx';
import Sidebar from './Sidebar.jsx';
import { SITE } from '../site.js';

/** Docs shell: topbar + sidebar + content + mobile scrim. */
export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="page">
      <Topbar menu onToggleMenu={() => setMenuOpen((o) => !o)} version="docs">
        <Link to="/">Home</Link>
        <a className="hide-sm" href={SITE.repo} target="_blank" rel="noopener">
          GitHub
        </a>
        <a className="hide-sm" href={SITE.npm} target="_blank" rel="noopener">
          npm
        </a>
        <ThemeButton />
      </Topbar>
      <Sidebar open={menuOpen} />
      <div className={menuOpen ? 'scrim open' : 'scrim'} onClick={() => setMenuOpen(false)} />
      <main className="main" id="content">
        <div className="main-inner">{children}</div>
      </main>
    </div>
  );
}
