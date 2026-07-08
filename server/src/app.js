import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.cors.origin }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files statically.
  app.use('/uploads', express.static(path.resolve(env.uploads.dir)));

  // Liveness/readiness probe (used by Docker healthcheck).
  app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

  // Versioned API surface.
  app.use('/api/v1', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
