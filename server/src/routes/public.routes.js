import { Router } from 'express';
import { resumeController } from '../controllers/resume.controller.js';

const router = Router();

// Unauthenticated read access to resumes flagged `public`.
router.get('/resumes/:id', resumeController.getPublic);

export default router;
