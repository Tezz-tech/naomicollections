import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '../features/auth/api';
import { useAuthStore } from '../store/authStore';

// Silently checks for an existing session (httpOnly cookie) on load so the
// header/account state is correct without forcing a visible loading screen.
export default function AuthInitializer() {
  const { setUser, clearUser } = useAuthStore();

  const { data, isError, isFetched } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    retry: false,
  });

  useEffect(() => {
    if (!isFetched) return;
    if (isError) clearUser();
    else setUser(data);
  }, [data, isError, isFetched, setUser, clearUser]);

  return null;
}
