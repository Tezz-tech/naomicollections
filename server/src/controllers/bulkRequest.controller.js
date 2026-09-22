import BulkRequest from '../models/BulkRequest.js';
import Order from '../models/Order.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { sendEmail, wrapBrandedEmail } from '../services/email.service.js';
import { env } from '../config/env.js';
import { computeOrderTotals } from '../services/order.service.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

export const createBulkRequest = catchAsync(async (req, res) => {
  const request = await BulkRequest.create({ ...req.body, user: req.user?._id || null });

  await sendEmail({
    to: request.email,
    subject: "We've received your bulk quote request — Naomi's Collections",
    type: 'bulk_quote_received',
    relatedUser: req.user?._id,
    html: wrapBrandedEmail({
      heading: 'Quote Request Received',
      bodyHtml: `Thanks, ${request.name.split(' ')[0]} — we've received your request for ${request.items.length} item(s) and will send a quote within 1-2 business days.`,
    }),
  });

  await sendEmail({
    to: env.superAdmin.email,
    subject: `New Bulk Quote Request — ${request.name}`,
    type: 'admin_bulk_request',
    html: wrapBrandedEmail({
      heading: 'New Bulk Quote Request',
      bodyHtml: `${request.name} (${request.businessName || 'individual'}) requested a quote for ${request.items.length} item(s), delivering to ${request.deliveryLocation}.`,
      ctaText: 'View in Admin',
      ctaUrl: `${env.adminUrl}/bulk-requests/${request._id}`,
    }),
  });

  res.status(201).json({
    success: true,
    message: "Your quote request has been received — we'll be in touch shortly.",
    data: { request },
  });
});

export const listMyBulkRequests = catchAsync(async (req, res) => {
  const requests = await BulkRequest.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: { requests } });
});

export const getBulkRequest = catchAsync(async (req, res) => {
  const request = await BulkRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Request not found.');
  if (req.user.role === 'customer' && request.user?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have access to this request.');
  }
  res.json({ success: true, data: { request } });
});

// --- Admin ---

export const listAllBulkRequests = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const requests = await BulkRequest.find(filter).sort('-createdAt');
  res.json({ success: true, data: { requests } });
});

export const respondWithQuote = catchAsync(async (req, res) => {
  const { amount, notes } = req.body;
  const request = await BulkRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Request not found.');

  request.status = 'quoted';
  request.quote = { amount, notes, sentAt: new Date() };
  await request.save();

  await sendEmail({
    to: request.email,
    subject: `Your Bulk Quote — ${request.name}`,
    type: 'bulk_quote_response',
    relatedUser: request.user,
    html: wrapBrandedEmail({
      heading: 'Your Custom Quote Is Ready',
      bodyHtml: `
        <p>Hi ${request.name.split(' ')[0]}, here's your quote for ${request.items.length} item(s):</p>
        <p style="font-size:20px;margin-top:8px;">₦${amount.toLocaleString()}</p>
        ${notes ? `<p>${notes}</p>` : ''}
        <p>Reply to this email or contact us to proceed with your order.</p>
      `,
    }),
  });

  res.json({ success: true, data: { request } });
});

export const closeBulkRequest = catchAsync(async (req, res) => {
  const request = await BulkRequest.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
  if (!request) throw new ApiError(404, 'Request not found.');
  res.json({ success: true, data: { request } });
});

// Converts an accepted quote into a real Order — the admin selects actual
// catalog items/quantities here (BulkRequest.items are free-text asks), so
// this reuses the same server-authoritative pricing/stock path as checkout.
export const convertToOrder = catchAsync(async (req, res) => {
  const { items: rawItems, shippingAddress } = req.body;
  const request = await BulkRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Request not found.');
  if (request.status === 'converted') throw new ApiError(400, 'This request has already been converted.');

  const { items, subtotal, discount, deliveryFee, total, delivery } = await computeOrderTotals({
    items: rawItems,
    state: shippingAddress.state,
    city: shippingAddress.city,
  });

  const orderNumber = await generateOrderNumber();
  const order = await Order.create({
    orderNumber,
    user: request.user || null,
    guestInfo: request.user ? undefined : { name: request.name, email: request.email, phone: request.phone },
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    shippingAddress,
    deliveryZone: delivery?.zone?._id,
    estimatedDeliveryDate: delivery?.estimatedDeliveryDate,
    isBulkOrder: true,
    source: 'bulk_quote',
    bulkRequest: request._id,
  });

  request.status = 'converted';
  request.convertedOrder = order._id;
  await request.save();

  res.status(201).json({ success: true, data: { order } });
});
