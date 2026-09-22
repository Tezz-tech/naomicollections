import { api } from '../../lib/axios';

export async function initializePayment(payload) {
  const { data } = await api.post('/payments/initialize', payload);
  return data.data;
}

export async function verifyPayment(reference) {
  const { data } = await api.get(`/payments/verify/${reference}`);
  return data.data.order;
}
