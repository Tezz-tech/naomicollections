import Order from '../models/Order.js';
import { sendEmail, wrapBrandedEmail } from './email.service.js';
import { env } from '../config/env.js';

// Our checkout flow always creates an Order (status: pending, paymentStatus:
// pending) before redirecting to Paystack, so an order stuck in that state
// past the window below is our signal for "started checkout, never paid" —
// there's no separate server-side cart to track for this.
const ABANDONED_WINDOW_HOURS = 1;
const REMINDER_MAX_AGE_HOURS = 48;

export async function sendAbandonedCartReminders() {
  const now = Date.now();
  const from = new Date(now - REMINDER_MAX_AGE_HOURS * 60 * 60 * 1000);
  const to = new Date(now - ABANDONED_WINDOW_HOURS * 60 * 60 * 1000);

  const candidates = await Order.find({
    paymentStatus: 'pending',
    status: { $ne: 'cancelled' },
    createdAt: { $gte: from, $lte: to },
    abandonedReminderSentAt: { $exists: false },
  }).populate('user', 'name email');

  let sent = 0;
  for (const order of candidates) {
    const recipient = order.user?.email || order.guestInfo?.email;
    if (!recipient) continue;

    await sendEmail({
      to: recipient,
      subject: `You left something in your bag — ${env.clientUrl.replace(/^https?:\/\//, '')}`,
      type: 'abandoned_cart',
      relatedOrder: order._id,
      relatedUser: order.user?._id,
      html: wrapBrandedEmail({
        heading: "Still thinking it over?",
        bodyHtml: `
          <p>Your order ${order.orderNumber} is still waiting — complete your payment before your reserved items are released.</p>
        `,
        ctaText: 'Complete Payment',
        ctaUrl: `${env.clientUrl}/checkout`,
      }),
    });

    order.abandonedReminderSentAt = new Date();
    await order.save();
    sent += 1;
  }

  return { checked: candidates.length, sent };
}
