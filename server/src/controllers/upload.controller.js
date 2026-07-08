import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const uploadController = {
  single: asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded (field name: "file")');

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return sendSuccess(res, {
      statusCode: 201,
      message: 'File uploaded',
      data: { url, filename: req.file.filename, size: req.file.size },
    });
  }),
};
