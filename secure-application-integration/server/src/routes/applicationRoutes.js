import { Router } from 'express';
import {
  getApplicationsForReview,
  getMyApplications,
  reviewApplicationStatus,
  submitApplication
} from '../controllers/applicationController.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import { requireReviewKey } from '../middleware/requireReviewKey.js';
import { requireSession } from '../middleware/requireSession.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateApplication } from '../validators/applicationValidator.js';

const router = Router();
router.use(requireSession);
router.get('/mine', getMyApplications);
router.get('/review', requireReviewKey, getApplicationsForReview);
router.post('/:id/review', requireReviewKey, reviewApplicationStatus);
router.post('/', createRateLimiter({ windowMs: 60 * 60 * 1000, limit: 10 }), validateRequest(validateApplication), submitApplication);
export default router;
