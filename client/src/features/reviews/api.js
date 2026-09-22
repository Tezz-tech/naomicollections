import { api } from '../../lib/axios';

export async function fetchProductReviews(productId) {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data.data.reviews;
}

export async function submitReview(payload) {
  const { data } = await api.post('/reviews', payload);
  return data;
}
