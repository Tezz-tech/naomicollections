import mongoose from 'mongoose';

export const EMAIL_TYPES = [
  'welcome_verify',
  'password_reset',
  'order_confirmation',
  'payment_received',
  'order_status',
  'delivery_confirmation',
  'bulk_quote_received',
  'bulk_quote_response',
  'abandoned_cart',
  'newsletter',
  'admin_new_order',
  'admin_bulk_request',
  'custom',
];

const emailLogSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, enum: EMAIL_TYPES, required: true },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    error: { type: String },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

emailLogSchema.index({ createdAt: -1 });
emailLogSchema.index({ type: 1 });

export default mongoose.model('EmailLog', emailLogSchema);
