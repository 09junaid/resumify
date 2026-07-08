import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// POST /api/v1/uploads  (multipart, field: "file")
router.post('/', authenticate, upload.single('file'), uploadController.single);

export default router;
