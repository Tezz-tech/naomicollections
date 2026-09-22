import { api } from '../../lib/axios';

export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data.data.user;
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data.data.user;
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data.data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function forgotPassword(payload) {
  const { data } = await api.post('/auth/forgot-password', payload);
  return data.message;
}

export async function resetPassword(payload) {
  const { data } = await api.post('/auth/reset-password', payload);
  return data.message;
}

export async function verifyEmail(token) {
  const { data } = await api.post('/auth/verify-email', { token });
  return data.message;
}

export async function changePassword(payload) {
  const { data } = await api.patch('/auth/change-password', payload);
  return data.message;
}
