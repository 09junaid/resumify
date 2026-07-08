import { Router } from 'express';
import { resumeController } from '../controllers/resume.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Every resume route requires authentication.
router.use(authenticate);

router.route('/').get(resumeController.list).post(resumeController.create);

router
  .route('/:id')
  .get(resumeController.getOne)
  .patch(resumeController.update)
  .delete(resumeController.remove);

export default router;
