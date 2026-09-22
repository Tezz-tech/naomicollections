import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

async function recalculateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId, status: 'approved' } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: Math.round(avg * 10) / 10,
    ratingsCount: count,
  });
}

export const listProductReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
    .populate('user', 'name')
    .sort('-createdAt');
  res.json({ success: true, data: { reviews } });
});

export const createReview = catchAsync(async (req, res) => {
  const { product, rating, title, comment } = req.body;

  const exists = await Product.findById(product);
  if (!exists) throw new ApiError(404, 'Product not found.');

  const isVerifiedPurchase = await Order.exists({
    user: req.user._id,
    paymentStatus: 'paid',
    'items.product': product,
  });

  const review = await Review.findOneAndUpdate(
    { product, user: req.user._id },
    { rating, title, comment, isVerifiedPurchase: !!isVerifiedPurchase, status: 'pending' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({
    success: true,
    message: 'Thank you — your review is awaiting approval.',
    data: { review },
  });
});

export const listAllReviews = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const reviews = await Review.find(filter)
    .populate('user', 'name email')
    .populate('product', 'name slug images')
    .sort('-createdAt');
  res.json({ success: true, data: { reviews } });
});

export const setReviewStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!review) throw new ApiError(404, 'Review not found.');
  await recalculateProductRating(review.product);
  res.json({ success: true, data: { review } });
});
