import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar, { ThemeButton } from '../components/Topbar.jsx';
import CopyButton from '../components/CopyButton.jsx';
import CodeSample from '../components/CodeSample.jsx';
import { SITE } from '../site.js';
import { QUICKSTART_JS, MIDDLEWARE_JS } from '../lib/samples.js';
import stats from '../generated/stats.json';

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
  </svg>
);

const FEATURES = [
  {
    icon: <path d="M4 7h16M4 12h10M4 17h7" />,
    title: 'Routing',
    body: (
      <>
        <code>:params</code>, <code>*</code> wildcards, <code>router.route()</code> and mounted
        sub-routers with prefix stripping.
      </>
    ),
  },
  {
    icon: <path d="M12 3v18M3 12h18" />,
    title: 'Middleware',
    body: 'One ordered stack. Registration order is execution order, exactly like Express.',
  },
  {
    icon: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="M4 10h16" />
      </>
    ),
    title: 'Body parsing',
    body: (
      <>
        <code>json</code>, <code>urlencoded</code>, <code>text</code> and <code>raw</code> with
        size limits, strict mode and 413 handling.
      </>
    ),
  },
  {
    icon: (
      <>
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 12l9 4 9-4M3 17l9 4 9-4" />
      </>
    ),
    title: 'Static files',
    body: (
      <>
        <code>serveStatic</code> with ETags, ranges, caching and traversal protection. Plus{' '}
        <code>res.sendFile</code>.
      </>
    ),
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" />
      </>
    ),
    title: 'CORS',
    body: (
      <>
        Correct preflight handling, origin reflection with credentials, and <code>Vary: Origin</code>.
      </>
    ),
  },
  {
    icon: (
      <>
        <path d="M6 3v12a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v9" />
        <path d="M3 6h3M18 15h3" />
      </>
    ),
    title: 'Compression',
    body: (
      <>
        Brotli, gzip or deflate chosen from <code>Accept-Encoding</code>, with a size threshold.
      </>
    ),
  },
  {
    icon: (
      <>
        <path d="M12 8v4l3 2" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
    title: 'Rate limiting',
    body: (
      <>
        Fixed-window limiter with <code>X-RateLimit-*</code>, <code>Retry-After</code> and a
        pluggable store.
      </>
    ),
  },
  {
    icon: <path d="M4 5h16M4 12h16M4 19h10" />,
    title: 'Logging',
    body: 'One line per request with method, URL, status and duration. Bring your own stream.',
  },
  {
    icon: <path d="M10.3 4.3L2 12l8.3 7.7M13.7 4.3L22 12l-8.3 7.7" />,
    title: 'Safe by default',
    body: 'Async errors are caught automatically, duplicate sends are ignored, and 405/OPTIONS are correct.',
  },
];

const COMPARE = [
  ['Runtime dependencies', <span className="yes">0</span>, <span className="no">~30 transitive</span>],
  ['Routing (:param, *)', <span className="yes">Built in</span>, 'via path-to-regexp'],
  ['Async error propagation', <span className="yes">Automatic</span>, <span className="no">Express 4: no</span>],
  ['405 + Allow', <span className="yes">Yes</span>, <span className="no">Returns 404</span>],
  ['Auto OPTIONS', <span className="yes">Yes</span>, 'Partial'],
  ['Double-send guard', <span className="yes">Yes</span>, <span className="no">Crashes</span>],
  ['Bundled CORS / compression / rate limit', <span className="yes">Yes</span>, <span className="no">Separate packages</span>],
  ['Template engines', <span className="no">No</span>, <span className="yes">Yes</span>],
  ['Ecosystem & maturity', <span className="no">New</span>, <span className="yes">Years of use</span>],
];

const DOCS_MAP = [
  {
    k: 'Introduction',
    to: '/getting-started',
    title: 'Getting started',
    body: 'What routiva is, the design philosophy, and your first server in a minute.',
    links: [
      ['Overview', '/getting-started'],
      ['Install', '/installation'],
      ['Quick start', '/quick-start'],
    ],
  },
  {
    k: 'Core concepts',
    to: '/routing',
    title: 'Routing & middleware',
    body: 'Path parameters, wildcards, the ordered layer stack and error handlers.',
    links: [
      ['Routing', '/routing'],
      ['Middleware', '/middleware'],
      ['Errors', '/error-handling'],
    ],
  },
  {
    k: 'Reference',
    to: '/request-response',
    title: 'Request & Response',
    body: (
      <>
        Every helper on the wrapped objects, from <code>req.accepts()</code> to{' '}
        <code>res.format()</code>.
      </>
    ),
    links: [
      ['req & res', '/request-response'],
      ['API index', '/api-reference'],
    ],
  },
  {
    k: 'Built-in middleware',
    to: '/cors',
    title: 'CORS, compression, limits',
    body: 'The middleware that ships in the core, with every option documented.',
    links: [
      ['CORS', '/cors'],
      ['Compression', '/compression'],
      ['Rate limiting', '/rate-limiting'],
      ['Logging', '/logging'],
    ],
  },
  {
    k: 'Guides',
    to: '/examples',
    title: 'Examples & testing',
    body: 'A runnable demo, a full CRUD API, and how the test suite works.',
    links: [
      ['Examples', '/examples'],
      ['Testing', '/testing'],
      ['Performance', '/performance'],
    ],
  },
  {
    k: 'Internals',
    to: '/architecture',
    title: 'Architecture',
    body: 'How dispatch, param restoration and path compilation actually work.',
    links: [
      ['Architecture', '/architecture'],
      ['From Express', '/express-comparison'],
      ['FAQ', '/faq'],
    ],
  },
];

export default function Landing() {
  useEffect(() => {
    document.title = 'routiva — a zero-dependency Express alternative for Node.js';
  }, []);

  const { version, tests, sourceFiles, loc } = stats;
  const kLoc = `~${(loc / 1000).toFixed(1)}k`;

  return (
    <div className="page landing">
      <Topbar version={version}>
        <Link to="/getting-started">Docs</Link>
        <Link className="hide-sm" to="/api-reference">
          API
        </Link>
        <a className="hide-sm" href={SITE.repo} target="_blank" rel="noopener">
          GitHub
        </a>
        <ThemeButton />
      </Topbar>

      <main id="content">
        <section className="hero">
          <div className="wrap">
            <span className="pill">
              <span className="dot" /> Zero dependencies · Node 18+ · MIT
            </span>
            <h1>
              The web framework you can <span className="serif">read in an afternoon</span>.
            </h1>
            <p className="sub">
              routiva gives you the Express ergonomics you already know — routing, middleware, body
              parsing, static files, CORS, compression and rate limiting — in about{' '}
              <strong>{loc.toLocaleString()} lines of dependency-free JavaScript</strong> built
              directly on <code>node:http</code>.
            </p>
            <div className="hero-actions">
              <span className="install">
                <span className="prompt">$</span>
                <span className="cmd">npm install routiva</span>
                <CopyButton text="npm install routiva" />
              </span>
              <Link className="btn btn-primary" to="/getting-started">
                Read the docs
                <Arrow />
              </Link>
              <a className="btn btn-ghost" href={SITE.repo} target="_blank" rel="noopener">
                <GithubIcon />
                GitHub
              </a>
            </div>
            <div className="hero-meta">
              <span>
                <b>{version}</b> latest on npm
              </span>
              <span>
                <b>0</b> runtime dependencies
              </span>
              <span>
                <b>{tests}</b> tests, no test framework
              </span>
              <span>
                <b>{sourceFiles}</b> source files
              </span>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="wrap">
            <div className="stat">
              <div className="n">
                0<small>deps</small>
              </div>
              <div className="l">Runtime dependencies</div>
            </div>
            <div className="stat">
              <div className="n">{kLoc}</div>
              <div className="l">Lines of source</div>
            </div>
            <div className="stat">
              <div className="n">
                {tests}
                <small>pass</small>
              </div>
              <div className="l">Test suite</div>
            </div>
            <div className="stat">
              <div className="n">3</div>
              <div className="l">Body parsers + raw</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Batteries included</div>
              <h2>Everything you reach for, without the graph of packages.</h2>
              <p>Each of these ships in the core. In Express, most of them are a separate install.</p>
            </div>
            <div className="features">
              {FEATURES.map((f) => (
                <div className="card" key={f.title}>
                  <div className="ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      {f.icon}
                    </svg>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="showcase">
              <div className="showcase-copy">
                <div className="eyebrow">Familiar API</div>
                <h3>Looks like Express. Reads like a book.</h3>
                <p>
                  If you know Express, you already know routiva. Import <code>App</code>, register
                  middleware and routes, and listen.
                </p>
                <ul>
                  <li>
                    Named ESM exports and <code>App.*</code> statics
                  </li>
                  <li>
                    <code>req.params</code>, <code>req.query</code>, <code>req.cookies</code>,{' '}
                    <code>req.body</code>
                  </li>
                  <li>
                    Chainable <code>res.status().type().json()</code>
                  </li>
                  <li>Async handlers that reject into your error middleware</li>
                </ul>
              </div>
              <CodeSample label="server.js" lang="js" code={QUICKSTART_JS} />
            </div>

            <div className="showcase rev" style={{ marginTop: 56 }}>
              <CodeSample label="app.js" lang="js" code={MIDDLEWARE_JS} />
              <div className="showcase-copy">
                <div className="eyebrow">Stricter HTTP</div>
                <h3>Correct by default, not by convention.</h3>
                <p>routiva handles the awkward corners of HTTP that Express leaves to you.</p>
                <ul>
                  <li>
                    <code>405 Method Not Allowed</code> with a real <code>Allow</code> header
                  </li>
                  <li>
                    Automatic <code>OPTIONS</code> responses (<code>204</code>)
                  </li>
                  <li>
                    <code>HEAD</code> reuses <code>GET</code> routes with the body suppressed
                  </li>
                  <li>
                    Async <code>throw</code> and rejected promises reach error middleware
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Honest comparison</div>
              <h2>routiva vs. Express</h2>
              <p>
                Not a rewrite of Express — a transparent, dependency-free core for when that is what
                you want.
              </p>
            </div>
            <div className="compare">
              <table>
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th className="hl">routiva</th>
                    <th>Express</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr key={i}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Documentation</div>
              <h2>Start where you are.</h2>
              <p>Twenty-one pages covering the API, the internals and the tradeoffs.</p>
            </div>
            <div className="docs-map">
              {DOCS_MAP.map((card) => (
                <div className="map-card" key={card.title}>
                  <span className="k">{card.k}</span>
                  <h3>
                    <Link to={card.to}>{card.title}</Link>
                  </h3>
                  <p>{card.body}</p>
                  <span className="links">
                    {card.links.map(([label, to]) => (
                      <Link key={label} to={to}>
                        {label}
                      </Link>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta">
              <h2>Ship something small and understandable.</h2>
              <p>
                Install routiva, read the core in an afternoon, and never wonder which of thirty
                packages broke your build.
              </p>
              <div className="hero-actions">
                <span className="install">
                  <span className="prompt">$</span>
                  <span className="cmd">npm install routiva</span>
                  <CopyButton text="npm install routiva" />
                </span>
                <Link className="btn btn-primary" to="/quick-start">
                  Quick start
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="wrap">
            <div className="cols">
              <div className="about">
                <Link className="brand" to="/">
                  <span className="mark">r</span>
                  <span>routiva</span>
                </Link>
                <p>
                  A lightweight, zero-dependency Express.js alternative for Node.js. Built on{' '}
                  <code>node:http</code>.
                </p>
              </div>
              <div>
                <h4>Docs</h4>
                <ul>
                  <li>
                    <Link to="/getting-started">Getting started</Link>
                  </li>
                  <li>
                    <Link to="/routing">Routing</Link>
                  </li>
                  <li>
                    <Link to="/middleware">Middleware</Link>
                  </li>
                  <li>
                    <Link to="/api-reference">API reference</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Guides</h4>
                <ul>
                  <li>
                    <Link to="/examples">Examples</Link>
                  </li>
                  <li>
                    <Link to="/testing">Testing</Link>
                  </li>
                  <li>
                    <Link to="/performance">Performance</Link>
                  </li>
                  <li>
                    <Link to="/express-comparison">Coming from Express</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Project</h4>
                <ul>
                  <li>
                    <a href={SITE.repo} target="_blank" rel="noopener">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href={SITE.npm} target="_blank" rel="noopener">
                      npm
                    </a>
                  </li>
                  <li>
                    <a href={`${SITE.repo}/issues`} target="_blank" rel="noopener">
                      Issues
                    </a>
                  </li>
                  <li>
                    <a href={`${SITE.repo}/blob/main/LICENSE`} target="_blank" rel="noopener">
                      MIT License
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="base">
              <span>MIT © {new Date().getFullYear()} uditcoderrr</span>
              <span className="built">built with routiva · zero dependencies</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
