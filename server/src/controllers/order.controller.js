import Order, { ORDER_STATUSES } from '../models/Order.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { computeOrderTotals } from '../services/order.service.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { sendEmail, wrapBrandedEmail } from '../services/email.service.js';
import { formatDate } from '../utils/format.js';
import { env } from '../config/env.js';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const getQuote = catchAsync(async (req, res) => {
  const { items, state, city, couponCode } = req.body;
  const { subtotal, discount, deliveryFee, total, delivery } = await computeOrderTotals({
    items,
    state,
    city,
    couponCode,
  });

  res.json({
    success: true,
    data: {
      subtotal,
      discount,
      deliveryFee,
      total,
      estimatedDeliveryDate: delivery?.estimatedDeliveryDate ?? null,
      deliveryWindow: delivery ? { minDays: delivery.minDays, maxDays: delivery.maxDays } : null,
      freeDeliveryApplied: delivery?.freeDeliveryApplied ?? false,
    },
  });
});

export const createOrder = catchAsync(async (req, res) => {
  const { items: rawItems, shippingAddress, couponCode, guestInfo } = req.body;

  if (!req.user && !guestInfo) {
    throw new ApiError(400, 'Guest checkout requires contact details.');
  }

  const { items, subtotal, discount, deliveryFee, total, delivery, coupon } = await computeOrderTotals({
    items: rawItems,
    state: shippingAddress.state,
    city: shippingAddress.city,
    couponCode,
  });

  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: req.user?._id || null,
    guestInfo: req.user ? undefined : guestInfo,
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    coupon: coupon ? { code: coupon.code, amount: discount } : undefined,
    shippingAddress,
    deliveryZone: delivery?.zone?._id,
    estimatedDeliveryDate: delivery?.estimatedDeliveryDate,
    isBulkOrder: items.some((i) => i.saleType === 'bulk'),
  });

  res.status(201).json({ success: true, data: { order } });
});

function canAccessOrder(order, req) {
  if (req.user) {
    return order.user?.toString() === req.user._id.toString() || ['admin', 'super-admin'].includes(req.user.role);
  }
  if (order.guestInfo?.email && req.query.email) {
    return order.guestInfo.email.toLowerCase() === String(req.query.email).toLowerCase();
  }
  return false;
}

export const getOrderByNumber = catchAsync(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate(
    'user',
    'name email'
  );
  if (!order) throw new ApiError(404, 'Order not found.');
  if (!canAccessOrder(order, req)) throw new ApiError(403, 'You do not have access to this order.');

  res.json({ success: true, data: { order } });
});

export const listMyOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: { orders } });
});

// --- Admin ---

export const listAllOrders = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  if (req.query.search) {
    filter.$or = [
      { orderNumber: { $regex: req.query.search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: req.query.search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: req.query.search, $options: 'i' } },
      { 'guestInfo.email': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
});

export const getAdminOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json({ success: true, data: { order } });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status, note } = req.body;
  if (!ORDER_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status.');

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found.');

  order.status = status;
  order.statusHistory.push({ status, note, date: new Date() });
  await order.save();

  const to = order.user?.email || order.guestInfo?.email;
  if (to) {
    await sendEmail({
      to,
      subject: `Order Update — ${order.orderNumber} is now ${STATUS_LABELS[status]}`,
      type: status === 'delivered' ? 'delivery_confirmation' : 'order_status',
      relatedOrder: order._id,
      relatedUser: order.user?._id,
      html: wrapBrandedEmail({
        heading: `Your order is now ${STATUS_LABELS[status]}`,
        bodyHtml: `
          <p>Order <strong>${order.orderNumber}</strong> has been updated.</p>
          ${note ? `<p>${note}</p>` : ''}
          ${order.estimatedDeliveryDate ? `<p>Estimated delivery: ${formatDate(order.estimatedDeliveryDate)}</p>` : ''}
        `,
        ctaText: 'Track Order',
        ctaUrl: `${env.clientUrl}/order/${order.orderNumber}`,
      }),
    });
  }

  res.json({ success: true, data: { order } });
});

export const updateEstimatedDelivery = catchAsync(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { estimatedDeliveryDate: req.body.estimatedDeliveryDate },
    { new: true }
  );
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json({ success: true, data: { order } });
});

export const addTrackingNote = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found.');
  order.trackingNotes.push({ note: req.body.note, addedBy: req.user._id, date: new Date() });
  await order.save();
  res.json({ success: true, data: { order } });
});
