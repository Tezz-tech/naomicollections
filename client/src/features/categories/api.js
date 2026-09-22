import { api } from '../../lib/axios';

export async function fetchCategories(all = false) {
  const { data } = await api.get('/categories', { params: all ? { all: 'true' } : {} });
  return data.data.categories;
}

export async function createCategory(payload) {
  const { data } = await api.post('/categories', payload);
  return data.data.category;
}

export async function updateCategory(id, payload) {
  const { data } = await api.patch(`/categories/${id}`, payload);
  return data.data.category;
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}

export async function reorderCategories(order) {
  await api.patch('/categories/reorder', { order });
}
