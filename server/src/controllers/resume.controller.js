import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { resumeService } from '../services/resume.service.js';

export const resumeController = {
  list: asyncHandler(async (req, res) => {
    const resumes = await resumeService.list(req.user.id);
    return sendSuccess(res, { data: { resumes } });
  }),

  getOne: asyncHandler(async (req, res) => {
    const resume = await resumeService.getById(req.user.id, req.params.id);
    return sendSuccess(res, { data: { resume } });
  }),

  getPublic: asyncHandler(async (req, res) => {
    const resume = await resumeService.getPublicById(req.params.id);
    return sendSuccess(res, { data: { resume } });
  }),

  create: asyncHandler(async (req, res) => {
    const resume = await resumeService.create(req.user.id, req.body);
    return sendSuccess(res, { statusCode: 201, message: 'Resume created', data: { resume } });
  }),

  update: asyncHandler(async (req, res) => {
    const resume = await resumeService.update(req.user.id, req.params.id, req.body);
    return sendSuccess(res, { message: 'Resume updated', data: { resume } });
  }),

  remove: asyncHandler(async (req, res) => {
    await resumeService.remove(req.user.id, req.params.id);
    return sendSuccess(res, { message: 'Resume deleted' });
  }),
};
