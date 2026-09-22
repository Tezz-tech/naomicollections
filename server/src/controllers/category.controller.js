import Category from '../models/Category.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

export const listCategories = catchAsync(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort('sortOrder name');
  res.json({ success: true, data: { categories } });
});

export const getCategory = catchAsync(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, data: { category } });
});

export const createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: { category } });
});

export const updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, data: { category } });
});

export const deleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, message: 'Category deleted.' });
});

export const reorderCategories = catchAsync(async (req, res) => {
  const { order } = req.body;
  await Promise.all(
    order.map(({ id, sortOrder }) => Category.findByIdAndUpdate(id, { sortOrder }))
  );
  res.json({ success: true, message: 'Categories reordered.' });
});
