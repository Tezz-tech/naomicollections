import { api } from '../../lib/axios';

export async function updateProfile(payload) {
  const { data } = await api.patch('/users/profile', payload);
  return data.data.user;
}

export async function addAddress(payload) {
  const { data } = await api.post('/users/addresses', payload);
  return data.data.addresses;
}

export async function updateAddress(addressId, payload) {
  const { data } = await api.patch(`/users/addresses/${addressId}`, payload);
  return data.data.addresses;
}

export async function deleteAddress(addressId) {
  const { data } = await api.delete(`/users/addresses/${addressId}`);
  return data.data.addresses;
}

export async function fetchWishlist() {
  const { data } = await api.get('/users/wishlist');
  return data.data.products;
}

export async function toggleWishlist(productId) {
  const { data } = await api.post(`/users/wishlist/${productId}`);
  return data.data;
}
