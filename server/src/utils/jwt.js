import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
  });
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tokenVersion: user.tokenVersion },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpires }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

const msFromExpiry = {
  accessToken: 15 * 60 * 1000,
  refreshToken: 30 * 24 * 60 * 60 * 1000,
};

export function setAuthCookies(res, { accessToken, refreshToken }) {
  const isProd = env.nodeEnv === 'production';
  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };

  res.cookie('accessToken', accessToken, { ...base, maxAge: msFromExpiry.accessToken });
  res.cookie('refreshToken', refreshToken, { ...base, maxAge: msFromExpiry.refreshToken });
}

export function clearAuthCookies(res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}
