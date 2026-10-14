import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * A file-backed JSON store for products.
 *
 * Reads are synchronous against an in-memory array (fast, zero-await in
 * handlers). Mutations persist asynchronously with an atomic write — we write a
 * temp file and `rename` it over the target, which is atomic on POSIX — and a
 * promise chain so concurrent writes can never interleave and corrupt the file.
 *
 * Swap this class for a real database (Postgres, Mongo, SQLite) and nothing
 * else in the app has to change: the routes only depend on this small surface.
 */
export class ProductStore {
  constructor(file) {
    this.file = file;
    this.products = [];
    this.nextId = 1;
    this._tail = Promise.resolve();
  }

  /** Load products from disk. A missing file means "start empty". */
  async load() {
    try {
      const raw = await fs.readFile(this.file, 'utf8');
      const parsed = JSON.parse(raw);
      this.products = Array.isArray(parsed.products) ? parsed.products : [];
      this.nextId = Number.isInteger(parsed.nextId)
        ? parsed.nextId
        : maxId(this.products) + 1;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      this.products = [];
      this.nextId = 1;
    }
    return this;
  }

  _persist() {
    const snapshot = JSON.stringify(
      { nextId: this.nextId, products: this.products },
      null,
      2,
    );
    this._tail = this._tail.then(() => writeAtomic(this.file, snapshot));
    return this._tail;
  }

  /** Paginated, filtered, sorted list. */
  list({
    search,
    category,
    inStock,
    sort = 'created',
    order = 'asc',
    page = 1,
    limit = 10,
  } = {}) {
    let items = this.products.slice();

    if (search) {
      const needle = String(search).toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.sku.toLowerCase().includes(needle),
      );
    }
    if (category) items = items.filter((p) => p.category === category);
    if (inStock === true) items = items.filter((p) => p.stock > 0);
    else if (inStock === false) items = items.filter((p) => p.stock === 0);

    const comparators = {
      created: (a, b) => a.id - b.id,
      name: (a, b) => a.name.localeCompare(b.name),
      price: (a, b) => a.price - b.price,
      stock: (a, b) => a.stock - b.stock,
    };
    const compare = comparators[sort] || comparators.created;
    const direction = order === 'desc' ? -1 : 1;
    items.sort((a, b) => compare(a, b) * direction);

    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    return { data: items.slice(start, start + limit), page, limit, total, pages };
  }

  get(id) {
    return this.products.find((p) => p.id === id) || null;
  }

  /** Find by SKU, optionally ignoring one id (for update conflict checks). */
  findBySku(sku, excludeId = null) {
    const target = String(sku).toUpperCase();
    return (
      this.products.find(
        (p) => p.sku === target && p.id !== excludeId,
      ) || null
    );
  }

  categories() {
    return [...new Set(this.products.map((p) => p.category))].sort();
  }

  stats() {
    const inventoryValue = this.products.reduce(
      (sum, p) => sum + p.price * p.stock,
      0,
    );
    return {
      count: this.products.length,
      inStock: this.products.filter((p) => p.stock > 0).length,
      outOfStock: this.products.filter((p) => p.stock === 0).length,
      categories: this.categories().length,
      inventoryValue: Math.round(inventoryValue * 100) / 100,
    };
  }

  async create(data) {
    const now = new Date().toISOString();
    const product = {
      id: this.nextId++,
      name: data.name,
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      category: data.category,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(product);
    await this._persist();
    return product;
  }

  async update(id, data, { replace = false } = {}) {
    const product = this.get(id);
    if (!product) return null;

    if (replace) {
      product.name = data.name;
      product.sku = data.sku;
      product.price = data.price;
      product.stock = data.stock;
      product.category = data.category;
    } else {
      Object.assign(product, data);
    }
    product.updatedAt = new Date().toISOString();
    await this._persist();
    return product;
  }

  async remove(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    await this._persist();
    return true;
  }

  /** Seed the store with sample data when it is empty. */
  async seedIfEmpty(samples) {
    if (this.products.length > 0) return this;
    for (const sample of samples) await this.create(sample);
    return this;
  }
}

function maxId(products) {
  return products.reduce((max, p) => Math.max(max, p.id || 0), 0);
}

async function writeAtomic(file, contents) {
  // The data directory may not exist on first run (e.g. crud-app/data/).
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temp, contents);
  await fs.rename(temp, file);
}
