import mongoose from 'mongoose';

// Guest carts live client-side (Zustand + localStorage) and are synced into
// one of these on login. Logged-in users always read/write through here.
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: {
      size: String,
      color: String,
      sku: String,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    couponCode: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
