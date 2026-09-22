import Order from '../models/Order.js';

// e.g. NC-20260922-0007 — date-scoped so the sequence resets daily and stays short.
export async function generateOrderNumber() {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');

  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const count = await Order.countDocuments({ createdAt: { $gte: startOfDay } });

  const sequence = String(count + 1).padStart(4, '0');
  return `NC-${datePart}-${sequence}`;
}
