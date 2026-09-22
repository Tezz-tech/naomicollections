import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

// --- Dashboard ---
export const useOverview = () => useQuery({ queryKey: ['admin-overview'], queryFn: api.fetchOverview });
export const useNotifications = () =>
  useQuery({ queryKey: ['admin-notifications'], queryFn: api.fetchNotifications, refetchInterval: 60000 });

// --- Customers ---
export const useCustomers = (params) =>
  useQuery({ queryKey: ['admin-customers', params], queryFn: () => api.fetchCustomers(params), placeholderData: (p) => p });
export const useCustomer = (id) =>
  useQuery({ queryKey: ['admin-customer', id], queryFn: () => api.fetchCustomer(id), enabled: !!id });
export const useSetCustomerBlocked = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isBlocked }) => api.setCustomerBlocked(id, isBlocked),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-customers'] }),
  });
};

// --- Orders ---
export const useAdminOrders = (params) =>
  useQuery({ queryKey: ['admin-orders', params], queryFn: () => api.fetchAdminOrders(params), placeholderData: (p) => p });
export const useAdminOrder = (id) =>
  useQuery({ queryKey: ['admin-order', id], queryFn: () => api.fetchAdminOrder(id), enabled: !!id });
export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => api.updateOrderStatus(id, payload),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.setQueryData(['admin-order', order._id], order);
    },
  });
};
export const useUpdateEstimatedDelivery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date }) => api.updateEstimatedDelivery(id, date),
    onSuccess: (order) => qc.setQueryData(['admin-order', order._id], order),
  });
};
export const useAddTrackingNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }) => api.addTrackingNote(id, note),
    onSuccess: (order) => qc.setQueryData(['admin-order', order._id], order),
  });
};

// --- Bulk Requests ---
export const useAdminBulkRequests = (params) =>
  useQuery({ queryKey: ['admin-bulk-requests', params], queryFn: () => api.fetchAdminBulkRequests(params) });
export const useRespondToBulkRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => api.respondToBulkRequest(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bulk-requests'] }),
  });
};
export const useConvertBulkRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => api.convertBulkRequest(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bulk-requests'] }),
  });
};
export const useCloseBulkRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.closeBulkRequest,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bulk-requests'] }),
  });
};

// --- Delivery Zones ---
export const useAdminZones = () => useQuery({ queryKey: ['admin-zones'], queryFn: api.fetchAdminZones });
export const useUpsertZone = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.upsertZone, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-zones'] }) });
};
export const useDeleteZone = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteZone, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-zones'] }) });
};

// --- Coupons ---
export const useCoupons = () => useQuery({ queryKey: ['admin-coupons'], queryFn: api.fetchCoupons });
export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-coupons'] }) });
};
export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.updateCoupon(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-coupons'] }),
  });
};
export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-coupons'] }) });
};

// --- Banners ---
export const useAdminBanners = () => useQuery({ queryKey: ['admin-banners'], queryFn: api.fetchAdminBanners });
export const useCreateBanner = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createBanner, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-banners'] }) });
};
export const useUpdateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.updateBanner(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-banners'] }),
  });
};
export const useDeleteBanner = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteBanner, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-banners'] }) });
};

// --- Uploads ---
export const useUploadImages = () => useMutation({ mutationFn: ({ files, folder }) => api.uploadImages(files, folder) });

// --- Emails ---
export const useEmailLogs = (params) => useQuery({ queryKey: ['admin-email-logs', params], queryFn: () => api.fetchEmailLogs(params) });
export const useComposeEmail = () => useMutation({ mutationFn: api.composeEmail });
export const useSubscribers = () => useQuery({ queryKey: ['admin-subscribers'], queryFn: api.fetchSubscribers });
export const useSendNewsletter = () => useMutation({ mutationFn: api.sendNewsletter });
export const useRunAbandonedCartReminders = () => useMutation({ mutationFn: api.runAbandonedCartReminders });

// --- Payments ---
export const useAdminPayments = (params) => useQuery({ queryKey: ['admin-payments', params], queryFn: () => api.fetchAdminPayments(params) });

// --- Reviews ---
export const useAdminReviews = (params) => useQuery({ queryKey: ['admin-reviews', params], queryFn: () => api.fetchAdminReviews(params) });
export const useSetReviewStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => api.setReviewStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reviews'] }),
  });
};

// --- Admin Users ---
export const useAdmins = () => useQuery({ queryKey: ['admin-admins'], queryFn: api.fetchAdmins });
export const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createAdmin, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-admins'] }) });
};
export const useUpdateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.updateAdmin(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-admins'] }),
  });
};
export const useDeleteAdmin = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteAdmin, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-admins'] }) });
};

// --- Settings ---
export const useAdminSettings = () => useQuery({ queryKey: ['admin-settings'], queryFn: api.fetchAdminSettings });
export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
