import mongoose from 'mongoose';
import { createApp } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

// Cache across warm serverless invocations.
let app = null;

async function getApp() {
  if (app && mongoose.connection.readyState === 1) return app;
  await connectDB();
  app = createApp();
  return app;
}

export default async function handler(req, res) {
  const application = await getApp();
  return application(req, res);
}
