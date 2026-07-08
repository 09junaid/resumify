import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Cache app + connection across warm serverless invocations.
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
