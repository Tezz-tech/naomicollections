import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    sku: { type: String },
    size: String,
    color: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    saleType: { type: String, enum: ['single', 'bulk'], default: 'single' },
  },
  { _id: false }
);

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    note: String,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const trackingNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    lga: String,
    street: { type: String, required: true },
    landmark: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestInfo: {
      name: String,
      email: String,
      phone: String,
    },

    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },

    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    coupon: {
      code: String,
      amount: { type: Number, default: 0 },
    },

    shippingAddress: { type: addressSnapshotSchema, required: true },
    deliveryZone: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryZone' },
    estimatedDeliveryDate: Date,

    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: 'pending', note: 'Order placed', date: new Date() }],
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentReference: { type: String },
    paymentMethod: { type: String, default: 'paystack' },
    abandonedReminderSentAt: { type: Date },

    trackingNotes: { type: [trackingNoteSchema], default: [] },

    isBulkOrder: { type: Boolean, default: false },
    source: { type: String, enum: ['checkout', 'bulk_quote'], default: 'checkout' },
    bulkRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'BulkRequest', default: null },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

export default mongoose.model('Order', orderSchema);
