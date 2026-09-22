import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

// Cached on `global` (not just a module-level variable) so the connection
// survives across invocations on the same warm serverless instance even if
// this module were ever re-evaluated — the standard pattern for Mongoose on
// Vercel/Lambda. A fresh `mongoose.connect()` per request would exhaust
// Atlas's connection limit within minutes.
const cache = (global.__mongooseCache ??= { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(env.mongoUri)
      .then((m) => {
        console.log(`[db] connected -> ${m.connection.name}`);
        return m;
      })
      .catch((err) => {
        cache.promise = null; // allow a retry on the next call instead of caching the failure
        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
