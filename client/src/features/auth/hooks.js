import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import { useAuthStore } from '../../store/authStore';

// Invalidating everything (including ['auth', 'me']) right after login would
// trigger AuthInitializer to immediately re-fetch the session in the
// background — and on any hiccup (a slow cold start, a transient network
// blip) that re-fetch failing would call clearUser() and bounce the user
// straight back to the login page seconds after a successful login. We
// already have authoritative, fresh user data from the login/register
// response itself, so seed the cache with that directly instead of
// re-fetching it, and only invalidate everything else.
function applySession(queryClient, setUser, user) {
  setUser(user);
  queryClient.setQueryData(['auth', 'me'], user);
  queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] !== 'auth' });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: api.login,
    onSuccess: (user) => applySession(queryClient, setUser, user),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: api.register,
    onSuccess: (user) => applySession(queryClient, setUser, user),
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
