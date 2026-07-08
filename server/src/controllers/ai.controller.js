import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { aiService } from '../services/ai.service.js';

export const aiController = {
  generate: asyncHandler(async (req, res) => {
    const { task, field, content, context } = req.body || {};
    const text = await aiService.generate({ task, field, content, context });
    return sendSuccess(res, { message: 'Generated', data: { text } });
  }),
};
