export const QUICKSTART_JS = `import { createApp, json, logger } from 'routiva';

const app = createApp();

app.use(logger());
app.use(json());

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, query: req.query });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.listen(3000, () => console.log('http://localhost:3000'));`;

export const MIDDLEWARE_JS = `import { createApp, cors, compress, rateLimit } from 'routiva';

const app = createApp();

app.use(cors({ origin: 'https://example.com', credentials: true }));
app.use(compress({ threshold: '1kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// async errors flow into your error middleware automatically
app.get('/report', async (req, res) => {
  const data = await loadReport();   // a rejection becomes a 500
  res.json(data);
});

// 405 + Allow, HEAD and OPTIONS are handled for you
app.get('/health', (req, res) => res.send('ok'));`;
