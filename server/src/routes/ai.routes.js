import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/v1/ai/generate  (auth)
router.post('/generate', authenticate, aiController.generate);

export default router;
