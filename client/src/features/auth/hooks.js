import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import { useAuthStore } from '../../store/authStore';

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: api.login,
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries();
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: api.register,
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      clearUser();
      queryClient.invalidateQueries();
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: api.forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: api.resetPassword });
}

export function useVerifyEmail() {
  return useMutation({ mutationFn: api.verifyEmail });
}

export function useChangePassword() {
  return useMutation({ mutationFn: api.changePassword });
}
