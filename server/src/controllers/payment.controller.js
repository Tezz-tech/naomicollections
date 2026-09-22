import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { initializeTransaction, verifyTransaction, nairaToKobo } from '../services/paystack.service.js';
import { finalizePaidOrder, markPaymentFailed } from '../services/fulfillment.service.js';
import { env } from '../config/env.js';

export const initializePayment = catchAsync(async (req, res) => {
  const { orderId, email } = req.body;

  const order = await Order.findById(orderId).populate('user', 'email');
  if (!order) throw new ApiError(404, 'Order not found.');
  if (order.paymentStatus === 'paid') throw new ApiError(400, 'This order has already been paid for.');

  const customerEmail = order.user?.email || order.guestInfo?.email || email;
  if (!customerEmail) throw new ApiError(400, 'An email address is required to process payment.');

  const reference = `NC-PAY-${order.orderNumber}-${crypto.randomBytes(3).toString('hex')}`;

  await Payment.create({
    order: order._id,
    user: order.user?._id || null,
    reference,
    amount: order.total,
    status: 'pending',
  });

  const paystackData = await initializeTransaction({
    email: customerEmail,
    amountKobo: nairaToKobo(order.total),
    reference,
    callbackUrl: `${env.clientUrl}/order/success?reference=${reference}`,
    metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });

  order.paymentReference = reference;
  await order.save();

  res.json({
    success: true,
    data: { authorizationUrl: paystackData.authorization_url, reference },
  });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { reference } = req.params;
  const gatewayData = await verifyTransaction(reference);

  if (gatewayData.status !== 'success') {
    await markPaymentFailed({ reference, gatewayData });
    throw new ApiError(400, `Payment ${gatewayData.status}. Please try again.`);
  }

  const { order } = await finalizePaidOrder({ reference, gatewayData });
  res.json({ success: true, data: { order } });
});
