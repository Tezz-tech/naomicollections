import dotenv from 'dotenv';

dotenv.config();

function required(key, fallback = undefined) {
  const value = process.env[key] ?? fallback;
  return value;
}

export const env = {
  nodeEnv: required('NODE_ENV', 'development'),
  port: Number(required('PORT', 5000)),
  apiUrl: required('API_URL', 'http://localhost:5000'),
  clientUrl: required('CLIENT_URL', 'http://localhost:5173'),
  adminUrl: required('ADMIN_URL', 'http://localhost:5173/admin'),
  // Extra origins allowed to call the API besides CLIENT_URL/ADMIN_URL — e.g.
  // a platform default domain (my-app.vercel.app) alongside a custom domain,
  // or the apex + www variants of the same domain. Comma-separated.
  extraAllowedOrigins: required('EXTRA_ALLOWED_ORIGINS', '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  mongoUri: required('MONGO_URI', 'mongodb://127.0.0.1:27017/naomis-collections'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev_access_secret_change_me'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
    accessExpires: required('JWT_ACCESS_EXPIRES', '15m'),
    refreshExpires: required('JWT_REFRESH_EXPIRES', '30d'),
  },

  cookieDomain: required('COOKIE_DOMAIN', 'localhost'),

  paystack: {
    secretKey: required('PAYSTACK_SECRET_KEY', ''),
    publicKey: required('PAYSTACK_PUBLIC_KEY', ''),
  },

  cloudinary: {
    cloudName: required('CLOUDINARY_CLOUD_NAME', ''),
    apiKey: required('CLOUDINARY_API_KEY', ''),
    apiSecret: required('CLOUDINARY_API_SECRET', ''),
  },

  email: {
    provider: required('EMAIL_PROVIDER', 'resend'),
    smtpHost: required('SMTP_HOST', ''),
    smtpPort: Number(required('SMTP_PORT', 587)),
    smtpUser: required('SMTP_USER', ''),
    smtpPass: required('SMTP_PASS', ''),
    from: required('EMAIL_FROM', "Naomi's Collections <no-reply@naomiscollections.com>"),
    resendApiKey: required('RESEND_API_KEY', ''),
  },

  superAdmin: {
    name: required('SUPER_ADMIN_NAME', 'Naomi Admin'),
    email: required('SUPER_ADMIN_EMAIL', 'admin@naomiscollections.com'),
    password: required('SUPER_ADMIN_PASSWORD', 'ChangeMe123!'),
  },

  rateLimit: {
    windowMs: Number(required('RATE_LIMIT_WINDOW_MS', 900000)),
    max: Number(required('RATE_LIMIT_MAX', 100)),
  },
};
