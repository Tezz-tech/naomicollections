import { api } from '../../lib/axios';

export async function createBulkRequest(payload) {
  const { data } = await api.post('/bulk-requests', payload);
  return data;
}

export async function fetchMyBulkRequests() {
  const { data } = await api.get('/bulk-requests/mine');
  return data.data.requests;
}
