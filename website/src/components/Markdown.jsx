import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { copyText } from '../lib/copy.js';

/**
 * Renders pre-rendered Markdown HTML and makes it behave like a SPA:
 * internal links navigate client-side, `#hash` links scroll smoothly, and
 * copy buttons inside code blocks copy the code.
 */
export default function Markdown({ html, className = 'prose' }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const onClick = (e) => {
      const copy = e.target.closest('[data-copy]');
      if (copy && el.contains(copy)) {
        e.preventDefault();
        const block = copy.closest('.codeblock');
        const code = block && block.querySelector('pre code');
        copyText((code ? code.textContent : copy.getAttribute('data-copy') || '').trim());
        const original = copy.textContent;
        copy.textContent = 'Copied';
        copy.classList.add('copied');
        setTimeout(() => {
          copy.textContent = original;
          copy.classList.remove('copied');
        }, 1400);
        return;
      }

      const a = e.target.closest('a');
      if (!a || !el.contains(a)) return;
      const href = a.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#')) {
        e.preventDefault();
        const id = decodeURIComponent(href.slice(1));
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${id}`);
        return;
      }

      if (a.target === '_blank') return;
      if (href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
      }
    };

    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [html, navigate]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
