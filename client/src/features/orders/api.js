import { api } from '../../lib/axios';

export async function getQuote(payload) {
  const { data } = await api.post('/orders/quote', payload);
  return data.data;
}

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data.data.order;
}

export async function fetchOrderByNumber(orderNumber, email) {
  const { data } = await api.get(`/orders/${orderNumber}`, { params: email ? { email } : {} });
  return data.data.order;
}

export async function fetchMyOrders() {
  const { data } = await api.get('/orders/mine');
  return data.data.orders;
}
