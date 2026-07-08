import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await connectDB();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info(`🚀 API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  // Graceful shutdown so in-flight requests finish and Mongo closes cleanly.
  const shutdown = async (signal) => {
    logger.warn(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDB();
      logger.info('Closed connections. Bye 👋');
      process.exit(0);
    });
    // Force-exit if graceful shutdown stalls.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', reason);
  });
}

bootstrap().catch((err) => {
  logger.error('Fatal boot error', err);
  process.exit(1);
});
