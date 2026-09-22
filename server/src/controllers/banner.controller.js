import Banner from '../models/Banner.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

export const listPublicBanners = catchAsync(async (req, res) => {
  const now = new Date();
  const filter = {
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] },
    ],
  };
  if (req.query.position) filter.position = req.query.position;

  const banners = await Banner.find(filter).sort('sortOrder');
  res.json({ success: true, data: { banners } });
});

export const listAdminBanners = catchAsync(async (req, res) => {
  const banners = await Banner.find().sort('sortOrder');
  res.json({ success: true, data: { banners } });
});

export const createBanner = catchAsync(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, data: { banner } });
});

export const updateBanner = catchAsync(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner) throw new ApiError(404, 'Banner not found.');
  res.json({ success: true, data: { banner } });
});

export const deleteBanner = catchAsync(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found.');
  res.json({ success: true, message: 'Banner deleted.' });
});
