import User from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from './errorHandler.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) throw new ApiError(401, 'You must be logged in to do this.');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, 'This account no longer exists.');
  if (user.isBlocked) throw new ApiError(403, 'This account has been blocked.');

  req.user = user;
  next();
});

// Populates req.user if a valid access token cookie is present, but never
// blocks the request — used on routes that behave differently for guests.
export const attachUserIfPresent = catchAsync(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && !user.isBlocked) req.user = user;
  } catch {
    // ignore invalid/expired token for optional auth
  }
  next();
});

export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action.');
    }
    next();
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) throw new ApiError(401, 'You must be logged in to do this.');
    if (req.user.role === 'super-admin') return next();
    if (req.user.role === 'admin' && req.user.permissions.includes(permission)) return next();
    throw new ApiError(403, 'You do not have permission to perform this action.');
  };
}
