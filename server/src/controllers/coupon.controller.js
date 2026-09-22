import Coupon from '../models/Coupon.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { computeDiscount } from '../utils/coupons.js';

export const validateCoupon = catchAsync(async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) throw new ApiError(404, 'Invalid coupon code.');

  const result = coupon.isValidFor(subtotal);
  if (!result.ok) throw new ApiError(400, result.reason);

  const discount = computeDiscount(coupon, subtotal);
  res.json({ success: true, data: { code: coupon.code, discount, type: coupon.type, value: coupon.value } });
});

export const listCoupons = catchAsync(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, data: { coupons } });
});

export const createCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
  res.status(201).json({ success: true, data: { coupon } });
});

export const updateCoupon = catchAsync(async (req, res) => {
  const payload = { ...req.body };
  if (payload.code) payload.code = payload.code.toUpperCase();
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new ApiError(404, 'Coupon not found.');
  res.json({ success: true, data: { coupon } });
});

export const deleteCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found.');
  res.json({ success: true, message: 'Coupon deleted.' });
});
