import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

async function fetchBanners(position) {
  const { data } = await api.get('/banners', { params: position ? { position } : {} });
  return data.data.banners;
}

export function useBanners(position = 'hero') {
  return useQuery({
    queryKey: ['banners', position],
    queryFn: () => fetchBanners(position),
    staleTime: 5 * 60 * 1000,
  });
}
