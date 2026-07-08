import { Router } from 'express';
import authRoutes from './auth.routes.js';
import resumeRoutes from './resume.routes.js';
import uploadRoutes from './upload.routes.js';
import publicRoutes from './public.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/uploads', uploadRoutes);
router.use('/public', publicRoutes);
router.use('/ai', aiRoutes);

export default router;
