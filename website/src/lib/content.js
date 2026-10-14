import { parseFrontmatter, renderMarkdown, stripTags } from './markdown.js';
import { SECTION_ORDER } from '../site.js';

/**
 * Every page is a Markdown file under src/content/. Vite inlines them as raw
 * strings at build time, so no runtime fetch is needed.
 */
const modules = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const sectionIndex = (name) => {
  const idx = SECTION_ORDER.indexOf(name);
  return idx === -1 ? SECTION_ORDER.length : idx;
};

function buildPages() {
  const pages = Object.entries(modules).map(([file, raw]) => {
    const slug = file.split('/').pop().replace(/\.md$/, '');
    const { data, body } = parseFrontmatter(raw);
    const cleaned = body.replace(/^\s*#\s+.*\n/, ''); // drop a leading H1
    const { html, headings } = renderMarkdown(cleaned);
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      section: data.section || 'Reference',
      order: Number(data.order || 0),
      html,
      headings,
      text: stripTags(html),
    };
  });

  pages.sort((a, b) => {
    const s = sectionIndex(a.section) - sectionIndex(b.section);
    if (s !== 0) return s;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  return pages;
}

export const pages = buildPages();

export const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));

export const searchIndex = [
  {
    title: 'Home',
    section: 'Overview',
    description: 'A zero-dependency Express.js alternative for Node.js.',
    url: '/',
    text: 'routiva zero dependency express alternative node.js routing middleware body parsing static files cors compression rate limiting',
  },
  ...pages.map((page) => ({
    title: page.title,
    section: page.section,
    description: page.description,
    url: `/${page.slug}`,
    text: page.text.slice(0, 6000),
  })),
];

/** Resolve a route param (which may still carry a legacy .html suffix). */
export function resolveSlug(param) {
  if (!param) return '';
  return param.replace(/\.html$/, '').replace(/^index$/, '');
}
