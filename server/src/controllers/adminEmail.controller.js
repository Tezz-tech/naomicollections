import EmailLog from '../models/EmailLog.js';
import Subscriber from '../models/Subscriber.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { sendEmail, wrapBrandedEmail } from '../services/email.service.js';
import { sendAbandonedCartReminders } from '../services/abandonedCart.service.js';

export const listEmailLogs = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 30, 100);

  const [logs, total] = await Promise.all([
    EmailLog.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    EmailLog.countDocuments(filter),
  ]);

  res.json({ success: true, data: { logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
});

export const composeEmail = catchAsync(async (req, res) => {
  const { to, subject, message, userId } = req.body;

  let recipient = to;
  let relatedUser = userId || null;
  if (userId && !to) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found.');
    recipient = user.email;
  }
  if (!recipient) throw new ApiError(400, 'A recipient email is required.');

  await sendEmail({
    to: recipient,
    subject,
    type: 'custom',
    relatedUser,
    html: wrapBrandedEmail({ heading: subject, bodyHtml: message.replace(/\n/g, '<br/>') }),
  });

  res.json({ success: true, message: 'Email sent.' });
});

export const listSubscribers = catchAsync(async (req, res) => {
  const subscribers = await Subscriber.find({ isActive: true }).sort('-createdAt');
  res.json({ success: true, data: { subscribers } });
});

export const sendNewsletter = catchAsync(async (req, res) => {
  const { subject, message } = req.body;
  const subscribers = await Subscriber.find({ isActive: true });

  const html = wrapBrandedEmail({ heading: subject, bodyHtml: message.replace(/\n/g, '<br/>') });

  await Promise.all(
    subscribers.map((s) => sendEmail({ to: s.email, subject, type: 'newsletter', html }))
  );

  res.json({ success: true, message: `Newsletter sent to ${subscribers.length} subscriber(s).` });
});

// Meant to run on a schedule (cron / platform scheduled job) — also exposed
// here so an admin can trigger it on demand. See scripts/sendAbandonedCartReminders.js.
export const runAbandonedCartReminders = catchAsync(async (req, res) => {
  const result = await sendAbandonedCartReminders();
  res.json({ success: true, message: `Sent ${result.sent} of ${result.checked} eligible reminder(s).`, data: result });
});
