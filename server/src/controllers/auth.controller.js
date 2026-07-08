import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { authService } from '../services/auth.service.js';
import { validateLogin, validateRegister } from '../validators/auth.validator.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const dto = validateRegister(req.body);
    const { user, token } = await authService.register(dto);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account created',
      data: { user, token },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const dto = validateLogin(req.body);
    const { user, token } = await authService.login(dto);
    return sendSuccess(res, { message: 'Logged in', data: { user, token } });
  }),

  me: asyncHandler(async (req, res) => {
    return sendSuccess(res, { data: { user: req.user } });
  }),
};
