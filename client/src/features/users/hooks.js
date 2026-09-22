import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import { useAuthStore } from '../../store/authStore';

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({ mutationFn: api.updateProfile, onSuccess: setUser });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, payload }) => api.updateAddress(addressId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}

export function useWishlist() {
  const user = useAuthStore((s) => s.user);
  return useQuery({ queryKey: ['wishlist'], queryFn: api.fetchWishlist, enabled: !!user });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.toggleWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });
}
