// Run on a schedule (e.g. hourly) via cron or your host's scheduled-job
// feature: `node src/scripts/sendAbandonedCartReminders.js`
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { sendAbandonedCartReminders } from '../services/abandonedCart.service.js';

async function run() {
  await connectDB();
  const result = await sendAbandonedCartReminders();
  console.log(`[abandoned-cart] checked ${result.checked}, sent ${result.sent} reminder(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('[abandoned-cart] failed:', err);
  process.exit(1);
});
