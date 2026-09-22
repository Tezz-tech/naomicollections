import mongoose from 'mongoose';

// Singleton document — always fetched/updated via findOneOrCreate below.
const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Naomi's Collections" },
    storeEmail: { type: String, default: 'hello@naomiscollections.com' },
    storePhone: { type: String, default: '' },
    currency: { type: String, default: 'NGN' },

    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },

    announcementBar: {
      text: { type: String, default: '' },
      link: { type: String, default: '' },
      isActive: { type: Boolean, default: false },
    },

    freeDeliveryThreshold: { type: Number, default: 100000 },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);

export async function getSettings() {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
}

export default Setting;
