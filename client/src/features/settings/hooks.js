import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

async function fetchSettings() {
  const { data } = await api.get('/settings');
  return data.data.settings;
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000,
  });
}
