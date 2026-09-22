import mongoose from 'mongoose';

const stockNotificationSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String, default: null },
    email: { type: String, required: true, lowercase: true, trim: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

stockNotificationSchema.index({ product: 1, variantSku: 1, notified: 1 });

export default mongoose.model('StockNotification', stockNotificationSchema);
