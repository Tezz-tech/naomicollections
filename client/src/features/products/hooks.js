import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import { fetchProducts, fetchProduct, fetchRelatedProducts } from './api';

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });
}

export function useRelatedProducts(slug) {
  return useQuery({
    queryKey: ['related-products', slug],
    queryFn: () => fetchRelatedProducts(slug),
    enabled: !!slug,
  });
}

// --- Admin ---

export function useAdminProduct(id) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => api.fetchAdminProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.updateProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
