import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

const ALLOWED_FOLDERS = ['products', 'categories', 'banners', 'general'];

// The browser uploads the actual file bytes directly to Cloudinary — never
// through this server (important on serverless, where function payload
// size/duration are constrained). This endpoint only ever proves "an admin
// asked for this" and hands back a short-lived signature; the API secret
// itself never leaves the server.
export const getUploadSignature = catchAsync(async (req, res) => {
  const requestedFolder = req.query.folder;
  const folder = `naomis-collections/${ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : 'general'}`;
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, env.cloudinary.apiSecret);

  res.json({
    success: true,
    data: {
      signature,
      timestamp,
      folder,
      apiKey: env.cloudinary.apiKey,
      cloudName: env.cloudinary.cloudName,
    },
  });
});

export const deleteImage = catchAsync(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw new ApiError(400, 'publicId is required.');
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Image deleted.' });
});
