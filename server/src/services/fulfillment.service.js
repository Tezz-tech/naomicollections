import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Coupon from '../models/Coupon.js';
import { sendEmail, wrapBrandedEmail } from './email.service.js';
import { formatNaira, formatDate } from '../utils/format.js';
import { env } from '../config/env.js';

async function deductStock(order) {
  for (const item of order.items) {
    if (item.sku) {
      await Product.updateOne(
        { _id: item.product, 'variants.sku': item.sku },
        { $inc: { 'variants.$.stock': -item.quantity, soldCount: item.quantity } }
      );
    } else {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } }
      );
    }
  }
}

function receiptRows(order) {
  return order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #E5E5E5;">
          ${item.name}${item.size || item.color ? ` (${[item.color, item.size].filter(Boolean).join(' / ')})` : ''}
          &times; ${item.quantity}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #E5E5E5;text-align:right;">${formatNaira(item.total)}</td>
      </tr>`
    )
    .join('');
}

async function sendOrderConfirmationEmail(order) {
  const to = order.user?.email || order.guestInfo?.email;
  if (!to) return;

  const html = wrapBrandedEmail({
    heading: `Order Confirmed — ${order.orderNumber}`,
    bodyHtml: `
      <p>Thank you for your order. Here's your receipt:</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:13px;">
        ${receiptRows(order)}
        <tr><td style="padding:8px 0;">Subtotal</td><td style="padding:8px 0;text-align:right;">${formatNaira(order.subtotal)}</td></tr>
        ${order.discount ? `<tr><td style="padding:8px 0;">Discount</td><td style="padding:8px 0;text-align:right;">-${formatNaira(order.discount)}</td></tr>` : ''}
        <tr><td style="padding:8px 0;">Delivery</td><td style="padding:8px 0;text-align:right;">${order.deliveryFee ? formatNaira(order.deliveryFee) : 'Free'}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold;">Total</td><td style="padding:10px 0;text-align:right;font-weight:bold;">${formatNaira(order.total)}</td></tr>
      </table>
      <p style="margin-top:16px;">Estimated delivery: ${order.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : 'TBC'}</p>
      <p>Shipping to: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
    `,
    ctaText: 'Track Your Order',
    ctaUrl: `${env.clientUrl}/order/${order.orderNumber}`,
  });

  await sendEmail({
    to,
    subject: `Order Confirmed — ${order.orderNumber}`,
    type: 'order_confirmation',
    relatedOrder: order._id,
    relatedUser: order.user?._id || order.user,
    html,
  });

  await sendEmail({
    to: env.superAdmin.email,
    subject: `New Order — ${order.orderNumber} (${formatNaira(order.total)})`,
    type: 'admin_new_order',
    relatedOrder: order._id,
    html: wrapBrandedEmail({
      heading: 'New Order Received',
      bodyHtml: `Order ${order.orderNumber} for ${formatNaira(order.total)} was just paid for.`,
      ctaText: 'View in Admin',
      ctaUrl: `${env.adminUrl}/orders/${order._id}`,
    }),
  });
}

// Shared by the payment-verify endpoint AND the Paystack webhook — both can
// fire for the same transaction, so this must be safe to run more than once.
export async function finalizePaidOrder({ reference, gatewayData }) {
  const payment = await Payment.findOne({ reference });
  if (!payment) throw new Error(`No payment record found for reference ${reference}`);

  if (payment.status === 'success') {
    const existingOrder = await Order.findById(payment.order).populate('user', 'name email');
    return { alreadyProcessed: true, payment, order: existingOrder };
  }

  payment.status = 'success';
  payment.channel = gatewayData.channel;
  payment.gatewayResponse = gatewayData;
  payment.paidAt = gatewayData.paid_at ? new Date(gatewayData.paid_at) : new Date();
  await payment.save();

  const order = await Order.findById(payment.order).populate('user', 'name email');
  if (!order) throw new Error(`No order found for payment ${reference}`);

  if (order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment received', date: new Date() });
    await order.save();
    await deductStock(order);
    if (order.coupon?.code) {
      await Coupon.updateOne({ code: order.coupon.code }, { $inc: { usedCount: 1 } });
    }
    await sendOrderConfirmationEmail(order);
  }

  return { alreadyProcessed: false, payment, order };
}

export async function markPaymentFailed({ reference, gatewayData }) {
  const payment = await Payment.findOne({ reference });
  if (!payment || payment.status === 'success') return;
  payment.status = 'failed';
  payment.gatewayResponse = gatewayData;
  await payment.save();
}
