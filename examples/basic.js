import { fileURLToPath } from 'node:url';
import { App, Router, HttpError } from '../src/index.js';

const publicDir = fileURLToPath(new URL('./public', import.meta.url));

const app = new App();

// --- Global middleware -----------------------------------------------------
app.use(App.logger());
app.use(App.cors({ origin: true, credentials: true }));
app.use(App.compress());
app.use(App.rateLimit({ windowMs: 60_000, max: 100 }));
app.use(App.json()); // parse JSON bodies (max 1mb)
app.use(App.serveStatic(publicDir, { maxAge: '1h' }));

// --- Routes ----------------------------------------------------------------
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, query: req.query, cookies: req.cookies });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.get('/download', (req, res) => {
  res.download(fileURLToPath(new URL('./public/style.css', import.meta.url)), 'style.css');
});

// Content negotiation: /greet -> JSON or HTML based on the Accept header.
app.get('/greet', (req, res) =>
  res.format({
    json: () => res.json({ hello: req.query.name || 'world' }),
    html: () => res.send(`<h1>Hello ${req.query.name || 'world'}</h1>`),
    default: () => res.status(406).send('Not Acceptable'),
  }),
);

// --- A mounted sub-router --------------------------------------------------
const api = new Router();
api.get('/status', (req, res) => res.json({ status: 'ok' }));
app.use('/api', api);

// --- Errors ----------------------------------------------------------------
app.get('/boom', () => {
  throw new HttpError(500, 'Something went wrong');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`routiva listening on http://localhost:${port}`);
});
