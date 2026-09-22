import DeliveryZone from '../models/DeliveryZone.js';
import { getSettings } from '../models/Setting.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

export const listPublicZones = catchAsync(async (req, res) => {
  const zones = await DeliveryZone.find({ isActive: true }).sort('state');
  const settings = await getSettings();
  res.json({
    success: true,
    data: { zones, freeDeliveryThreshold: settings.freeDeliveryThreshold },
  });
});

export const listAdminZones = catchAsync(async (req, res) => {
  const zones = await DeliveryZone.find().sort('state');
  res.json({ success: true, data: { zones } });
});

export const upsertZone = catchAsync(async (req, res) => {
  const zone = await DeliveryZone.findOneAndUpdate(
    { state: req.body.state },
    req.body,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json({ success: true, data: { zone } });
});

export const deleteZone = catchAsync(async (req, res) => {
  const zone = await DeliveryZone.findByIdAndDelete(req.params.id);
  if (!zone) throw new ApiError(404, 'Delivery zone not found.');
  res.json({ success: true, message: 'Delivery zone deleted.' });
});
