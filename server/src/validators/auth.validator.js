import { ApiError } from '../utils/ApiError.js';

const emailRe = /^\S+@\S+\.\S+$/;

/* Lightweight, dependency-free request validation.
 * Swap for zod/joi if schema complexity grows. */

export function validateRegister(body) {
  const { name, email, password } = body || {};
  const errors = [];

  if (!name || String(name).trim().length < 2) errors.push('name must be at least 2 characters');
  if (!email || !emailRe.test(email)) errors.push('email must be a valid address');
  if (!password || String(password).length < 6) errors.push('password must be at least 6 characters');

  if (errors.length) throw ApiError.badRequest('Validation failed', errors);

  return { name: name.trim(), email: email.toLowerCase().trim(), password };
}

export function validateLogin(body) {
  const { email, password } = body || {};
  const errors = [];

  if (!email || !emailRe.test(email)) errors.push('email must be a valid address');
  if (!password) errors.push('password is required');

  if (errors.length) throw ApiError.badRequest('Validation failed', errors);

  return { email: email.toLowerCase().trim(), password };
}
