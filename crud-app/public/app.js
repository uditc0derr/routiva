// Frontend for the routiva CRUD demo. Plain ES modules + fetch — no build step.

const api = {
  async request(path, options = {}) {
    const res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const body = res.status === 204 ? null : isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const message = body?.error?.message || res.statusText;
      const err = new Error(message);
      err.status = res.status;
      err.details = body?.error?.details;
      throw err;
    }
    return body;
  },
  list(params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null),
    ).toString();
    return this.request(`/products${qs ? `?${qs}` : ''}`);
  },
  stats: () => api.request('/stats'),
  health: () => api.request('/health'),
  create: (data) => api.request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => api.request(`/products/${id}`, { method: 'DELETE' }),
  restock: (id, amount) =>
    api.request(`/products/${id}/restock`, { method: 'POST', body: JSON.stringify({ amount }) }),
};

const state = { page: 1, limit: 8, search: '', category: '', sort: 'created', editingId: null };

const $ = (id) => document.getElementById(id);
const money = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

async function refresh() {
  await Promise.all([loadStats(), loadProducts(), loadCategories()]);
}

async function loadStats() {
  try {
    const s = await api.stats();
    $('stats').innerHTML = [
      ['Products', s.count],
      ['In stock', s.inStock],
      ['Out of stock', s.outOfStock],
      ['Inventory value', money(s.inventoryValue)],
    ]
      .map(([k, v]) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`)
      .join('');
  } catch (err) {
    console.error('stats failed', err);
  }
}

async function loadCategories() {
  const { data } = await api.request('/categories');
  const select = $('category-filter');
  select.innerHTML =
    '<option value="">All categories</option>' +
    data.map((c) => `<option value="${c}">${c}</option>`).join('');
  select.value = state.category;
}

async function loadProducts() {
  const result = await api.list({
    search: state.search,
    category: state.category,
    sort: state.sort,
    page: state.page,
    limit: state.limit,
  });

  const tbody = $('rows');
  if (result.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">No products found.</td></tr>';
  } else {
    tbody.innerHTML = result.data
      .map((p) => {
        const stockClass = p.stock === 0 ? 'stock-out' : p.stock < 5 ? 'stock-low' : '';
        return `<tr>
          <td>${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.sku)}</td>
          <td>${escapeHtml(p.category)}</td>
          <td class="num">${money(p.price)}</td>
          <td class="num ${stockClass}">${p.stock}</td>
          <td><div class="row-actions">
            <button class="mini" data-action="restock" data-id="${p.id}">+stock</button>
            <button class="mini" data-action="edit" data-id="${p.id}">Edit</button>
            <button class="mini danger" data-action="delete" data-id="${p.id}">Delete</button>
          </div></td>
        </tr>`;
      })
      .join('');
  }

  $('pager').innerHTML =
    `<button class="mini" data-page="${result.page - 1}" ${result.page <= 1 ? 'disabled' : ''}>Prev</button>` +
    `<span>Page ${result.page} of ${result.pages} · ${result.total} total</span>` +
    `<button class="mini" data-page="${result.page + 1}" ${result.page >= result.pages ? 'disabled' : ''}>Next</button>`;
}

function showFormError(message, details) {
  const el = $('form-error');
  if (!message) {
    el.hidden = true;
    el.textContent = '';
    return;
  }
  const extra = details ? ' (' + Object.entries(details).map(([k, v]) => `${k}: ${v}`).join('; ') + ')' : '';
  el.hidden = false;
  el.textContent = message + extra;
}

function startEdit(product) {
  state.editingId = product.id;
  $('id').value = product.id;
  $('name').value = product.name;
  $('sku').value = product.sku;
  $('price').value = product.price;
  $('stock').value = product.stock;
  $('category').value = product.category;
  $('form-title').textContent = `Edit #${product.id}`;
  $('submit-btn').textContent = 'Save changes';
  $('reset-btn').hidden = false;
  showFormError(null);
}

function resetForm() {
  state.editingId = null;
  $('product-form').reset();
  $('id').value = '';
  $('form-title').textContent = 'Add product';
  $('submit-btn').textContent = 'Create';
  $('reset-btn').hidden = true;
  showFormError(null);
}

// ── Events ────────────────────────────────────────────────────────────────────
$('product-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    name: $('name').value,
    sku: $('sku').value,
    price: Number($('price').value),
    stock: Number($('stock').value),
    category: $('category').value,
  };
  try {
    if (state.editingId) await api.update(state.editingId, payload);
    else await api.create(payload);
    resetForm();
    await refresh();
  } catch (err) {
    showFormError(err.message, err.details);
  }
});

$('reset-btn').addEventListener('click', resetForm);

$('rows').addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'edit') {
    const product = await api.request(`/products/${id}`);
    startEdit(product);
  } else if (action === 'delete') {
    if (confirm('Delete this product?')) {
      await api.remove(id);
      await refresh();
    }
  } else if (action === 'restock') {
    const input = prompt('How many units to add?', '10');
    if (input === null) return;
    try {
      await api.restock(id, Number(input));
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }
});

$('pager').addEventListener('click', (event) => {
  const page = event.target.closest('button[data-page]')?.dataset.page;
  if (page) {
    state.page = Number(page);
    loadProducts();
  }
});

let searchTimer;
$('search').addEventListener('input', (event) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = event.target.value.trim();
    state.page = 1;
    loadProducts();
  }, 200);
});

$('category-filter').addEventListener('change', (event) => {
  state.category = event.target.value;
  state.page = 1;
  loadProducts();
});

$('sort').addEventListener('change', (event) => {
  state.sort = event.target.value;
  loadProducts();
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

// ── Boot ──────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const health = await api.health();
    const badge = $('api-badge');
    badge.textContent = `API ${health.status} · up ${health.uptime}s`;
    badge.classList.add('ok');
    await refresh();
  } catch (err) {
    const badge = $('api-badge');
    badge.textContent = 'API unreachable';
    badge.classList.add('err');
    console.error(err);
  }
})();
