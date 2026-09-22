import { getSettings } from '../models/Setting.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getPublicSettings = catchAsync(async (req, res) => {
  const settings = await getSettings();
  res.json({
    success: true,
    data: {
      settings: {
        storeName: settings.storeName,
        socialLinks: settings.socialLinks,
        announcementBar: settings.announcementBar,
        currency: settings.currency,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
        storePhone: settings.storePhone,
        storeEmail: settings.storeEmail,
      },
    },
  });
});

export const getAdminSettings = catchAsync(async (req, res) => {
  const settings = await getSettings();
  res.json({ success: true, data: { settings } });
});

export const updateSettings = catchAsync(async (req, res) => {
  const current = await getSettings();
  Object.assign(current, req.body);
  await current.save();
  res.json({ success: true, data: { settings: current } });
});
