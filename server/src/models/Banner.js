import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: {
      url: { type: String, required: true },
      publicId: String,
    },
    ctaText: { type: String },
    ctaLink: { type: String },
    position: { type: String, enum: ['hero', 'category', 'promo'], default: 'hero' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

bannerSchema.index({ position: 1, sortOrder: 1 });

export default mongoose.model('Banner', bannerSchema);
