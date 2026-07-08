import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * Establish the MongoDB connection with sane defaults and
 * lifecycle logging. Retries are delegated to the orchestrator
 * (docker-compose `depends_on` + Mongo healthcheck).
 */
export async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => logger.info('🗄️  MongoDB connected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB error', err));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  await mongoose.connect(env.mongoUri);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
