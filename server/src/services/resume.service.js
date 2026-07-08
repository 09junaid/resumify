import { Resume } from '../models/resume.model.js';
import { ApiError } from '../utils/ApiError.js';

// Fields a client is allowed to write. Prevents mass-assignment of
// userId / timestamps from the request body.
const WRITABLE = [
  'title',
  'public',
  'template',
  'accent_color',
  'personal_info',
  'professional_summary',
  'skills',
  'experience',
  'education',
  'project',
  'certifications',
  'achievements',
  'sourceFile',
];

function pickWritable(payload = {}) {
  return WRITABLE.reduce((acc, key) => {
    if (payload[key] !== undefined) acc[key] = payload[key];
    return acc;
  }, {});
}

export const resumeService = {
  list(userId) {
    return Resume.find({ userId }).sort({ updatedAt: -1 });
  },

  async getById(userId, id) {
    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) throw ApiError.notFound('Resume not found');
    return resume;
  },

  async getPublicById(id) {
    const resume = await Resume.findOne({ _id: id, public: true });
    if (!resume) throw ApiError.notFound('Resume not found or not public');
    return resume;
  },

  create(userId, payload) {
    return Resume.create({ ...pickWritable(payload), userId });
  },

  async update(userId, id, payload) {
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId },
      { $set: pickWritable(payload) },
      { new: true, runValidators: true }
    );
    if (!resume) throw ApiError.notFound('Resume not found');
    return resume;
  },

  async remove(userId, id) {
    const resume = await Resume.findOneAndDelete({ _id: id, userId });
    if (!resume) throw ApiError.notFound('Resume not found');
    return resume;
  },
};
