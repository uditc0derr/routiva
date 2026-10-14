import { useEffect, useState } from 'react';

/** Sticky "On this page" table of contents with scroll-spy. */
export default function Toc({ headings }) {
  const items = headings.filter((h) => h.level === 2 || h.level === 3);
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!items.length) return undefined;
    const map = new Map();
    for (const h of items) {
      const el = document.getElementById(h.id);
      if (el) map.set(el, h.id);
    }
    if (!map.size) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(map.get(visible[0].target));
      },
      { rootMargin: '-84px 0px -70% 0px', threshold: 0 },
    );
    map.forEach((_id, el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!items.length) return null;

  return (
    <aside className="toc" aria-label="On this page">
      <div className="toc-label">On this page</div>
      {items.map((h) => (
        <a
          key={h.id}
          className={`${h.level === 3 ? 'h3' : ''}${active === h.id ? ' active' : ''}`.trim()}
          href={`#${h.id}`}
        >
          {h.text}
        </a>
      ))}
    </aside>
  );
}
