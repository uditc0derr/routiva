const MAX_NAME = 120;
const MAX_CATEGORY = 60;
const SKU_PATTERN = /^[A-Z0-9][A-Z0-9-]{1,39}$/;

/**
 * Validate a product payload.
 *
 * `partial: true` (PATCH) validates only supplied fields and injects no
 * defaults. Returns `{ ok, data, errors }` where `errors` maps field → message.
 */
export function validateProduct(input = {}, { partial = false } = {}) {
  const errors = {};
  const data = {};
  const has = (key) => input[key] !== undefined && input[key] !== null;

  if (!partial || has('name')) {
    if (typeof input.name !== 'string' || input.name.trim() === '') {
      errors.name = 'name is required';
    } else if (input.name.trim().length > MAX_NAME) {
      errors.name = `name must be ${MAX_NAME} characters or fewer`;
    } else {
      data.name = input.name.trim();
    }
  }

  if (!partial || has('sku')) {
    if (typeof input.sku !== 'string' || input.sku.trim() === '') {
      errors.sku = 'sku is required';
    } else {
      const sku = input.sku.trim().toUpperCase();
      if (!SKU_PATTERN.test(sku)) {
        errors.sku =
          'sku must be 2-40 chars, uppercase letters, digits or dashes';
      } else {
        data.sku = sku;
      }
    }
  }

  if (!partial || has('price')) {
    const price = toNumber(input.price);
    if (price === null || price < 0 || price > 1_000_000_000) {
      errors.price = 'price must be a number between 0 and 1,000,000,000';
    } else {
      data.price = price;
    }
  }

  if (!partial || has('stock')) {
    const stock = toNumber(input.stock);
    if (stock === null || !Number.isInteger(stock) || stock < 0) {
      errors.stock = 'stock must be a non-negative integer';
    } else {
      data.stock = stock;
    }
  }

  if (has('category')) {
    if (typeof input.category !== 'string' || input.category.trim() === '') {
      errors.category = 'category must be a non-empty string';
    } else if (input.category.trim().length > MAX_CATEGORY) {
      errors.category = `category must be ${MAX_CATEGORY} characters or fewer`;
    } else {
      data.category = input.category.trim();
    }
  } else if (!partial) {
    data.category = 'general';
  }

  return { ok: Object.keys(errors).length === 0, data, errors };
}

function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
