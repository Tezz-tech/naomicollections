import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    sku: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    // Optional per-variant override; falls back to the product's basePrice when unset.
    priceOverride: { type: Number, min: 0 },
  },
  { _id: true }
);

const bulkTierSchema = new mongoose.Schema(
  {
    minQty: { type: Number, required: true, min: 1 },
    maxQty: { type: Number, min: 1 }, // omit for "and above"
    pricePerUnit: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true, maxlength: 240 },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    brand: { type: String, default: "Naomi's Collections" },

    images: { type: [imageSchema], validate: (v) => v.length > 0 },

    variants: { type: [variantSchema], default: [] },
    // Used only when the product has no variants (e.g. a simple accessory).
    stock: { type: Number, default: 0, min: 0 },

    basePrice: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },

    saleType: {
      type: String,
      enum: ['single', 'bulk', 'both'],
      default: 'single',
    },
    minOrderQuantity: { type: Number, default: 1, min: 1 },
    bulkTiers: { type: [bulkTierSchema], default: [] },

    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },

    isFlashSale: { type: Boolean, default: false },
    flashSale: {
      startDate: Date,
      endDate: Date,
      discountPercent: { type: Number, min: 0, max: 90 },
    },

    sizeGuide: { type: String },

    seo: {
      metaTitle: String,
      metaDescription: String,
    },

    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }
  next();
});

productSchema.virtual('totalStock').get(function totalStock() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  return this.stock;
});

productSchema.virtual('isInStock').get(function isInStock() {
  return this.totalStock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isFlashSale: 1 });
productSchema.index({ saleType: 1 });
productSchema.index({ basePrice: 1 });

export default mongoose.model('Product', productSchema);
