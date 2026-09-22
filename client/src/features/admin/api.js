import { api } from '../../lib/axios';

// --- Dashboard ---
export const fetchOverview = async () => (await api.get('/admin/dashboard/overview')).data.data;
export const fetchNotifications = async () => (await api.get('/admin/dashboard/notifications')).data.data;

// --- Customers ---
export const fetchCustomers = async (params) => (await api.get('/admin/dashboard/customers', { params })).data.data;
export const fetchCustomer = async (id) => (await api.get(`/admin/dashboard/customers/${id}`)).data.data;
export const setCustomerBlocked = async (id, isBlocked) =>
  (await api.patch(`/admin/dashboard/customers/${id}/block`, { isBlocked })).data.data.customer;

// --- Orders ---
export const fetchAdminOrders = async (params) => (await api.get('/orders/admin/all', { params })).data.data;
export const fetchAdminOrder = async (id) => (await api.get(`/orders/admin/${id}`)).data.data.order;
export const updateOrderStatus = async (id, payload) =>
  (await api.patch(`/orders/admin/${id}/status`, payload)).data.data.order;
export const updateEstimatedDelivery = async (id, estimatedDeliveryDate) =>
  (await api.patch(`/orders/admin/${id}/delivery-date`, { estimatedDeliveryDate })).data.data.order;
export const addTrackingNote = async (id, note) =>
  (await api.post(`/orders/admin/${id}/tracking-notes`, { note })).data.data.order;

// --- Bulk Requests ---
export const fetchAdminBulkRequests = async (params) =>
  (await api.get('/bulk-requests/admin/all', { params })).data.data.requests;
export const respondToBulkRequest = async (id, payload) =>
  (await api.post(`/bulk-requests/admin/${id}/quote`, payload)).data.data.request;
export const convertBulkRequest = async (id, payload) =>
  (await api.post(`/bulk-requests/admin/${id}/convert`, payload)).data.data.order;
export const closeBulkRequest = async (id) => (await api.patch(`/bulk-requests/admin/${id}/close`)).data.data.request;

// --- Delivery Zones ---
export const fetchAdminZones = async () => (await api.get('/delivery-zones/admin')).data.data.zones;
export const upsertZone = async (payload) => (await api.put('/delivery-zones', payload)).data.data.zone;
export const deleteZone = async (id) => api.delete(`/delivery-zones/${id}`);

// --- Coupons ---
export const fetchCoupons = async () => (await api.get('/coupons')).data.data.coupons;
export const createCoupon = async (payload) => (await api.post('/coupons', payload)).data.data.coupon;
export const updateCoupon = async (id, payload) => (await api.patch(`/coupons/${id}`, payload)).data.data.coupon;
export const deleteCoupon = async (id) => api.delete(`/coupons/${id}`);

// --- Banners ---
export const fetchAdminBanners = async () => (await api.get('/banners/admin')).data.data.banners;
export const createBanner = async (payload) => (await api.post('/banners', payload)).data.data.banner;
export const updateBanner = async (id, payload) => (await api.patch(`/banners/${id}`, payload)).data.data.banner;
export const deleteBanner = async (id) => api.delete(`/banners/${id}`);

// --- Uploads ---
export const uploadImages = async (files, folder = 'general') => {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const { data } = await api.post(`/uploads?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.images;
};

// --- Emails ---
export const fetchEmailLogs = async (params) => (await api.get('/admin/emails/logs', { params })).data.data;
export const composeEmail = async (payload) => (await api.post('/admin/emails/compose', payload)).data;
export const fetchSubscribers = async () => (await api.get('/admin/emails/subscribers')).data.data.subscribers;
export const sendNewsletter = async (payload) => (await api.post('/admin/emails/newsletter', payload)).data;
export const runAbandonedCartReminders = async () => (await api.post('/admin/emails/abandoned-cart-reminders')).data;

// --- Payments ---
export const fetchAdminPayments = async (params) => (await api.get('/admin/payments', { params })).data.data;

// --- Reviews ---
export const fetchAdminReviews = async (params) => (await api.get('/reviews/admin/all', { params })).data.data.reviews;
export const setReviewStatus = async (id, status) => (await api.patch(`/reviews/${id}/status`, { status })).data.data.review;

// --- Admin Users ---
export const fetchAdmins = async () => (await api.get('/admin/admins')).data.data;
export const createAdmin = async (payload) => (await api.post('/admin/admins', payload)).data.data;
export const updateAdmin = async (id, payload) => (await api.patch(`/admin/admins/${id}`, payload)).data.data.admin;
export const deleteAdmin = async (id) => api.delete(`/admin/admins/${id}`);

// --- Settings ---
export const fetchAdminSettings = async () => (await api.get('/settings/admin')).data.data.settings;
export const updateSettings = async (payload) => (await api.patch('/settings/admin', payload)).data.data.settings;
