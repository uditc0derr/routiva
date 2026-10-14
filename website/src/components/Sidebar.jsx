import { NavLink } from 'react-router-dom';
import { pages } from '../lib/content.js';
import { SECTION_ORDER, SITE } from '../site.js';

/** Docs sidebar: pages grouped into sections, active page highlighted. */
export default function Sidebar({ open = false }) {
  return (
    <aside className={open ? 'sidebar open' : 'sidebar'} id="sidebar">
      {SECTION_ORDER.map((section) => {
        const group = pages.filter((p) => p.section === section);
        if (!group.length) return null;
        return (
          <div className="nav-section" key={section}>
            <div className="nav-label">{section}</div>
            {group.map((page) => (
              <NavLink
                key={page.slug}
                to={`/${page.slug}`}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {page.title}
              </NavLink>
            ))}
          </div>
        );
      })}
      <div className="sidebar-foot">
        <a href={SITE.repo} target="_blank" rel="noopener">
          GitHub ↗
        </a>
        <a href={SITE.npm} target="_blank" rel="noopener">
          npm ↗
        </a>
        <a href={`${SITE.repo}/blob/main/LICENSE`} target="_blank" rel="noopener">
          MIT ↗
        </a>
      </div>
    </aside>
  );
}
