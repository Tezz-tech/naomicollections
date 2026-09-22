import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateToken, hashToken } from '../utils/generateToken.js';
import {
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { sendEmail, wrapBrandedEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

async function issueSession(res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  setAuthCookies(res, { accessToken, refreshToken });
}

export const register = catchAsync(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  const rawToken = generateToken();
  const user = await User.create({
    name,
    email,
    password,
    phone,
    verificationToken: hashToken(rawToken),
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  const verifyUrl = `${env.clientUrl}/verify-email?token=${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email — Naomi's Collections",
    type: 'welcome_verify',
    relatedUser: user._id,
    html: wrapBrandedEmail({
      heading: `Welcome, ${user.name.split(' ')[0]}`,
      bodyHtml: `Thank you for creating an account with Naomi's Collections. Please confirm your email address to activate your account.`,
      ctaText: 'Verify Email',
      ctaUrl: verifyUrl,
    }),
  });

  await issueSession(res, user);
  res.status(201).json({ success: true, data: { user: user.toSafeJSON() } });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body;
  const hashed = hashToken(token);

  const user = await User.findOne({
    verificationToken: hashed,
    verificationTokenExpires: { $gt: Date.now() },
  }).select('+verificationToken +verificationTokenExpires');

  if (!user) throw new ApiError(400, 'This verification link is invalid or has expired.');

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Email verified successfully.' });
});

export const resendVerification = catchAsync(async (req, res) => {
  const user = req.user;
  if (user.isVerified) throw new ApiError(400, 'This account is already verified.');

  const rawToken = generateToken();
  user.verificationToken = hashToken(rawToken);
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const verifyUrl = `${env.clientUrl}/verify-email?token=${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email — Naomi's Collections",
    type: 'welcome_verify',
    relatedUser: user._id,
    html: wrapBrandedEmail({
      heading: 'Confirm your email',
      bodyHtml: 'Please confirm your email address to activate your account.',
      ctaText: 'Verify Email',
      ctaUrl: verifyUrl,
    }),
  });

  res.json({ success: true, message: 'Verification email sent.' });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Incorrect email or password.');
  }
  if (user.isBlocked) throw new ApiError(403, 'This account has been blocked.');

  await issueSession(res, user);
  res.json({ success: true, data: { user: user.toSafeJSON() } });
});

export const refresh = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, 'Not authenticated.');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }
  if (user.isBlocked) throw new ApiError(403, 'This account has been blocked.');

  await issueSession(res, user);
  res.json({ success: true, data: { user: user.toSafeJSON() } });
});

export const logout = catchAsync(async (req, res) => {
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out.' });
});

export const logoutAll = catchAsync(async (req, res) => {
  req.user.tokenVersion += 1;
  await req.user.save();
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out of all devices.' });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way to avoid leaking which emails are registered.
  if (user) {
    const rawToken = generateToken();
    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${env.clientUrl}/reset-password?token=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your password — Naomi's Collections",
      type: 'password_reset',
      relatedUser: user._id,
      html: wrapBrandedEmail({
        heading: 'Reset your password',
        bodyHtml: 'We received a request to reset your password. This link expires in 1 hour. If you did not request this, you can safely ignore this email.',
        ctaText: 'Reset Password',
        ctaUrl: resetUrl,
      }),
    });
  }

  res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  const hashed = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) throw new ApiError(400, 'This reset link is invalid or has expired.');

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.tokenVersion += 1;
  await user.save();

  res.json({ success: true, message: 'Password reset successfully. Please log in.' });
});

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect.');
  }

  user.password = newPassword;
  user.tokenVersion += 1;
  await user.save();
  await issueSession(res, user);

  res.json({ success: true, message: 'Password updated successfully.' });
});

export const getMe = catchAsync(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toSafeJSON() } });
});
