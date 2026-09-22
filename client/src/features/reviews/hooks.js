import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductReviews, submitReview } from './api';

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: !!productId,
  });
}

export function useSubmitReview(productId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', productId] }),
  });
}
