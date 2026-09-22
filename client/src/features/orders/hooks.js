import { useMutation, useQuery } from '@tanstack/react-query';
import { getQuote, createOrder, fetchOrderByNumber, fetchMyOrders } from './api';

export function useQuoteMutation() {
  return useMutation({ mutationFn: getQuote });
}

export function useCreateOrder() {
  return useMutation({ mutationFn: createOrder });
}

export function useOrder(orderNumber, email) {
  return useQuery({
    queryKey: ['order', orderNumber, email],
    queryFn: () => fetchOrderByNumber(orderNumber, email),
    enabled: !!orderNumber,
    retry: false,
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
  });
}
