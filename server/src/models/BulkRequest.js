import mongoose from 'mongoose';

const bulkRequestItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const bulkRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true },
    businessName: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    items: { type: [bulkRequestItemSchema], validate: (v) => v.length > 0 },
    deliveryLocation: { type: String, required: true },
    notes: { type: String },

    status: { type: String, enum: ['new', 'quoted', 'converted', 'closed'], default: 'new' },
    quote: {
      amount: Number,
      notes: String,
      sentAt: Date,
    },
    convertedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('BulkRequest', bulkRequestSchema);
