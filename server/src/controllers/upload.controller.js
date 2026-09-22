import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `naomis-collections/${folder}`, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export const uploadImages = catchAsync(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files.length) throw new ApiError(400, 'No image files provided.');

  const folder = req.query.folder || 'general';
  const results = await Promise.all(files.map((f) => uploadBuffer(f.buffer, folder)));

  res.json({
    success: true,
    data: {
      images: results.map((r) => ({ url: r.secure_url, publicId: r.public_id })),
    },
  });
});

export const deleteImage = catchAsync(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw new ApiError(400, 'publicId is required.');
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Image deleted.' });
});
