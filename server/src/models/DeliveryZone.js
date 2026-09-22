import mongoose from 'mongoose';

const cityOverrideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fee: { type: Number, required: true, min: 0 },
    minDays: { type: Number, required: true, min: 0 },
    maxDays: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const deliveryZoneSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, unique: true },
    fee: { type: Number, required: true, min: 0 },
    minDays: { type: Number, required: true, min: 0 },
    maxDays: { type: Number, required: true, min: 0 },
    // Optional per-city fee/timeline overrides within the state.
    cityOverrides: { type: [cityOverrideSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('DeliveryZone', deliveryZoneSchema);
