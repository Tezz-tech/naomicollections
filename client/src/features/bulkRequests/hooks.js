import { useMutation, useQuery } from '@tanstack/react-query';
import { createBulkRequest, fetchMyBulkRequests } from './api';

export function useCreateBulkRequest() {
  return useMutation({ mutationFn: createBulkRequest });
}

export function useMyBulkRequests() {
  return useQuery({ queryKey: ['my-bulk-requests'], queryFn: fetchMyBulkRequests });
}
