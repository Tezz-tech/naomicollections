import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import BulkRequest from '../models/BulkRequest.js';
import { catchAsync } from '../utils/catchAsync.js';

function startOfDay(d = new Date()) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export const getOverview = catchAsync(async (req, res) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 30);

  const paidFilter = { paymentStatus: 'paid' };

  const [revenueToday, revenueWeek, revenueMonth, ordersCount, recentOrders, topProducts, lowStockVariants, lowStockSimple, newBulkRequests] =
    await Promise.all([
      Order.aggregate([
        { $match: { ...paidFilter, createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { ...paidFilter, createdAt: { $gte: weekStart } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { ...paidFilter, createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.countDocuments({}),
      Order.find().sort('-createdAt').limit(8).select('orderNumber total status paymentStatus createdAt shippingAddress.fullName'),
      Product.find({ status: 'published' }).sort('-soldCount').limit(5).select('name images soldCount basePrice'),
      Product.aggregate([
        { $unwind: '$variants' },
        { $match: { 'variants.stock': { $lte: 5 } } },
        { $project: { name: 1, sku: '$variants.sku', stock: '$variants.stock', size: '$variants.size', color: '$variants.color' } },
        { $limit: 20 },
      ]),
      Product.find({ variants: { $size: 0 }, stock: { $lte: 5 }, status: 'published' })
        .select('name stock')
        .limit(20),
      BulkRequest.countDocuments({ status: 'new' }),
    ]);

  const salesChartRaw = await Order.aggregate([
    { $match: { ...paidFilter, createdAt: { $gte: monthStart } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthAgg = revenueMonth[0] || { total: 0, count: 0 };

  res.json({
    success: true,
    data: {
      revenue: {
        today: revenueToday[0]?.total || 0,
        week: revenueWeek[0]?.total || 0,
        month: monthAgg.total || 0,
      },
      ordersCount,
      ordersToday: revenueToday[0]?.count || 0,
      averageOrderValue: monthAgg.count ? Math.round(monthAgg.total / monthAgg.count) : 0,
      topProducts,
      lowStock: [...lowStockVariants, ...lowStockSimple.map((p) => ({ name: p.name, stock: p.stock }))],
      recentOrders,
      newBulkRequests,
      salesChart: salesChartRaw.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
    },
  });
});

export const getNotifications = catchAsync(async (req, res) => {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [newOrders, newBulkRequests, lowStockCount] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: dayAgo }, paymentStatus: 'paid' }),
    BulkRequest.countDocuments({ status: 'new' }),
    Product.countDocuments({ status: 'published', stock: { $lte: 5 }, variants: { $size: 0 } }),
  ]);

  res.json({ success: true, data: { newOrders, newBulkRequests, lowStockCount } });
});

export const listCustomers = catchAsync(async (req, res) => {
  const filter = { role: 'customer' };
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const [customers, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);

  const withOrderCounts = await Promise.all(
    customers.map(async (c) => {
      const orderCount = await Order.countDocuments({ user: c._id, paymentStatus: 'paid' });
      return { ...c.toSafeJSON(), orderCount };
    })
  );

  res.json({ success: true, data: { customers: withOrderCounts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
});

export const getCustomer = catchAsync(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
  const orders = await Order.find({ user: customer._id }).sort('-createdAt');
  res.json({ success: true, data: { customer: customer.toSafeJSON(), orders } });
});

export const setCustomerBlocked = catchAsync(async (req, res) => {
  const customer = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'customer' },
    { isBlocked: req.body.isBlocked },
    { new: true }
  );
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
  res.json({ success: true, data: { customer: customer.toSafeJSON() } });
});
