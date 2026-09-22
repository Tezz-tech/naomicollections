import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

export const updateProfile = catchAsync(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(phone && { phone }) },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: { user: user.toSafeJSON() } });
});

export const addAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  if (user.addresses.length === 0) req.body.isDefault = true;
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, data: { addresses: user.addresses } });
});

export const updateAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, 'Address not found.');

  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  Object.assign(address, req.body);
  await user.save();
  res.json({ success: true, data: { addresses: user.addresses } });
});

export const deleteAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, 'Address not found.');
  const wasDefault = address.isDefault;
  address.deleteOne();
  if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;
  await user.save();
  res.json({ success: true, data: { addresses: user.addresses } });
});

export const toggleWishlist = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;
  const exists = user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  res.json({ success: true, data: { wishlist: user.wishlist, added: !exists } });
});

export const getWishlist = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: { status: 'published' },
    populate: { path: 'category', select: 'name slug' },
  });
  res.json({ success: true, data: { products: user.wishlist } });
});
