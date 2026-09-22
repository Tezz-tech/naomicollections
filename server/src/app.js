import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [env.clientUrl, env.adminUrl].filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: "Naomi's Collections API is running", env: env.nodeEnv });
});

// Everything below needs the DB — including the webhook route mounted next.
// On a persistent server (local dev, Render), server.js connects once at
// boot and this resolves instantly thereafter. On Vercel, nothing ever calls
// server.js — this is what establishes (and, via the cache in config/db.js,
// reuses) the connection per warm function instance.
app.use((req, res, next) => {
  connectDB().then(() => next(), next);
});

// Paystack webhook needs the raw body for signature verification, so it is
// mounted with express.raw() before the global json() parser below.
import webhookRoutes from './routes/webhook.routes.js';
app.use('/api/webhooks', webhookRoutes);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

import routes from './routes/index.js';
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
