import { api } from '../../lib/axios';

export async function fetchProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data.data;
}

export async function fetchProduct(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data.data.product;
}

export async function fetchRelatedProducts(slug) {
  const { data } = await api.get(`/products/${slug}/related`);
  return data.data.products;
}

// --- Admin ---

export async function fetchAdminProduct(id) {
  const { data } = await api.get(`/products/admin/${id}`);
  return data.data.product;
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload);
  return data.data.product;
}

export async function updateProduct(id, payload) {
  const { data } = await api.patch(`/products/${id}`, payload);
  return data.data.product;
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}
