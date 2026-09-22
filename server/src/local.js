import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error('[server] Could not connect to MongoDB on boot:', err.message);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    console.log(`[server] Naomi's Collections API listening on port ${env.port} (${env.nodeEnv})`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('[server] Unhandled rejection:', err);
    server.close(() => process.exit(1));
  });
}

start();
