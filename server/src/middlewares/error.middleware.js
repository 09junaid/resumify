import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/* eslint-disable no-unused-vars */
/**
 * Central error handler. Normalises Mongoose/JWT/known errors into
 * a consistent JSON envelope and hides internals in production.
 */
export function errorHandler(err, _req, res, _next) {
  let error = err;

  // Mongoose duplicate key -> 409
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.conflict(`${field} already in use`);
  }

  // Mongoose validation -> 400
  if (err?.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest('Validation failed', details);
  }

  // Bad ObjectId -> 400
  if (err?.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}`);
  }

  if (!(error instanceof ApiError)) {
    logger.error(err);
    error = new ApiError(500, 'Internal server error');
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}
