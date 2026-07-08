let cachedApp = null;

async function getApp() {
  const mongoose = (await import('mongoose')).default;

  if (cachedApp && mongoose.connection.readyState === 1) return cachedApp;

  const { connectDB } = await import('../server/src/config/db.js');
  const { createApp } = await import('../server/src/app.js');

  await connectDB();
  cachedApp = createApp();
  return cachedApp;
}

export default async function handler(req, res) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err) {
    console.error('[HANDLER ERROR]', err.message, err.stack);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      hint: 'Check Vercel Function Logs for details',
    });
  }
}
