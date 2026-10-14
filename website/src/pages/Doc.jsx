import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Markdown from '../components/Markdown.jsx';
import Pager from '../components/Pager.jsx';
import Toc from '../components/Toc.jsx';
import { pages, pagesBySlug, resolveSlug } from '../lib/content.js';
import NotFound from './NotFound.jsx';

/** A single documentation page. */
export default function Doc() {
  const { slug: param } = useParams();
  const slug = resolveSlug(param);
  const page = pagesBySlug.get(slug);

  useEffect(() => {
    if (page) document.title = `${page.title} · routiva docs`;
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!page) return <NotFound />;

  const index = pages.indexOf(page);
  const prev = pages[index - 1];
  const next = pages[index + 1];

  return (
    <Layout>
      <article className="article">
        <header className="article-head">
          <div className="eyebrow">{page.section}</div>
          <h1>{page.title}</h1>
          <p className="lede">{page.description}</p>
        </header>
        <Markdown html={page.html} />
        <Pager prev={prev} next={next} />
      </article>
      <Toc headings={page.headings} />
    </Layout>
  );
}
