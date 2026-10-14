import { Link } from 'react-router-dom';

/** Previous / next page navigation. */
export default function Pager({ prev, next }) {
  return (
    <nav className="pager">
      {prev ? (
        <Link to={`/${prev.slug}`}>
          <span className="dir">Previous</span>
          <span className="t">{prev.title}</span>
        </Link>
      ) : (
        <span className="spacer" />
      )}
      {next ? (
        <Link className="next" to={`/${next.slug}`}>
          <span className="dir">Next</span>
          <span className="t">{next.title}</span>
        </Link>
      ) : (
        <span className="spacer" />
      )}
    </nav>
  );
}
