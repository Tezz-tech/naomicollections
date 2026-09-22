import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minSpend: { type: Number, default: 0 },
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValidFor = function isValidFor(subtotal) {
  if (!this.isActive) return { ok: false, reason: 'This coupon is no longer active.' };
  if (this.expiresAt && this.expiresAt < new Date()) {
    return { ok: false, reason: 'This coupon has expired.' };
  }
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
    return { ok: false, reason: 'This coupon has reached its usage limit.' };
  }
  if (subtotal < this.minSpend) {
    return { ok: false, reason: `Minimum spend of ₦${this.minSpend.toLocaleString()} required.` };
  }
  return { ok: true };
};

export default mongoose.model('Coupon', couponSchema);
