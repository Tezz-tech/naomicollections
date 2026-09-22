import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail, wrapBrandedEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

export const ADMIN_PERMISSIONS = [
  'products',
  'categories',
  'orders',
  'customers',
  'delivery',
  'coupons',
  'content',
  'emails',
  'payments',
  'reviews',
  'settings',
];

export const listAdmins = catchAsync(async (req, res) => {
  const admins = await User.find({ role: { $in: ['admin', 'super-admin'] } }).sort('-createdAt');
  res.json({
    success: true,
    data: { admins: admins.map((a) => a.toSafeJSON()), availablePermissions: ADMIN_PERMISSIONS },
  });
});

export const createAdmin = catchAsync(async (req, res) => {
  const { name, email, permissions } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'A user with this email already exists.');

  // Temp password — the new admin resets it via the standard forgot-password flow.
  const tempPassword = generateToken(9);
  const admin = await User.create({
    name,
    email,
    password: tempPassword,
    role: 'admin',
    permissions: permissions || [],
    isVerified: true,
  });

  await sendEmail({
    to: email,
    subject: "You've been added as an admin — Naomi's Collections",
    type: 'custom',
    relatedUser: admin._id,
    html: wrapBrandedEmail({
      heading: 'Welcome to the Team',
      bodyHtml: `
        <p>You've been added as an admin on Naomi's Collections.</p>
        <p>Temporary password: <strong>${tempPassword}</strong></p>
        <p>Please log in and change your password as soon as possible.</p>
      `,
      ctaText: 'Log In',
      ctaUrl: `${env.adminUrl}/login`,
    }),
  });

  res.status(201).json({ success: true, data: { admin: admin.toSafeJSON(), tempPassword } });
});

export const updateAdmin = catchAsync(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target || !['admin', 'super-admin'].includes(target.role)) {
    throw new ApiError(404, 'Admin not found.');
  }
  if (target.role === 'super-admin') throw new ApiError(403, 'Cannot modify a super-admin.');

  if (req.body.permissions) target.permissions = req.body.permissions;
  if (typeof req.body.isBlocked === 'boolean') target.isBlocked = req.body.isBlocked;
  await target.save();

  res.json({ success: true, data: { admin: target.toSafeJSON() } });
});

export const deleteAdmin = catchAsync(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target || target.role !== 'admin') throw new ApiError(404, 'Admin not found.');
  await target.deleteOne();
  res.json({ success: true, message: 'Admin removed.' });
});
