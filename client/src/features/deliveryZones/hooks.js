import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

async function fetchZones() {
  const { data } = await api.get('/delivery-zones');
  return data.data;
}

export function useDeliveryZones() {
  return useQuery({
    queryKey: ['delivery-zones'],
    queryFn: fetchZones,
    staleTime: 10 * 60 * 1000,
  });
}
