import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { buildProductQuery } from '../utils/apiFeatures.js';
import { notifyRestocked } from './stockNotification.controller.js';

export const listProducts = catchAsync(async (req, res) => {
  const { filter, sort, page, limit, skip } = buildProductQuery(req.query);

  // Public shop view only ever sees published products.
  if (!req.user || req.user.role === 'customer') {
    filter.status = 'published';
  }

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
});

export const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product || (product.status !== 'published' && req.user?.role === 'customer')) {
    throw new ApiError(404, 'Product not found.');
  }

  product.viewCount += 1;
  await product.save();

  res.json({ success: true, data: { product } });
});

export const getRelatedProducts = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new ApiError(404, 'Product not found.');

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: 'published',
  })
    .limit(8)
    .populate('category', 'name slug');

  res.json({ success: true, data: { products: related } });
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: { product } });
});

export const updateProduct = catchAsync(async (req, res) => {
  const before = await Product.findById(req.params.id);
  if (!before) throw new ApiError(404, 'Product not found.');
  const wasOutOfStock = before.totalStock <= 0;

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (wasOutOfStock && product.totalStock > 0) {
    notifyRestocked(product).catch((err) => console.error('[stock-notify] failed:', err.message));
  }

  res.json({ success: true, data: { product } });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ success: true, message: 'Product deleted.' });
});

export const getAdminProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ success: true, data: { product } });
});
