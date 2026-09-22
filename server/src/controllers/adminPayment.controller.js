import Payment from '../models/Payment.js';
import { catchAsync } from '../utils/catchAsync.js';

export const listPayments = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 30, 100);

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('order', 'orderNumber')
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    Payment.countDocuments(filter),
  ]);

  res.json({ success: true, data: { payments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
});
