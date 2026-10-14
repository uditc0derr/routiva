import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

/** 404 page, rendered inside the docs chrome. */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · routiva docs';
  }, []);

  return (
    <Layout>
      <article className="article">
        <header className="article-head">
          <div className="eyebrow">404</div>
          <h1>Page not found</h1>
          <p className="lede">The page you were looking for does not exist.</p>
        </header>
        <div className="prose">
          <p>
            That page does not exist. Try the <Link to="/">home page</Link> or{' '}
            <Link to="/getting-started">getting started</Link>, or press <code>⌘K</code> to search
            the docs.
          </p>
        </div>
      </article>
    </Layout>
  );
}
