import { Router } from 'express';
import { currentSession, login, logout, register } from '../controllers/authController.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateLogin, validateRegistration } from '../validators/authValidator.js';

const router = Router();
const authRateLimit = createRateLimiter({ windowMs: 15 * 60 * 1000, limit: 20 });

router.post('/register', authRateLimit, validateRequest(validateRegistration), register);
router.post('/login', authRateLimit, validateRequest(validateLogin), login);
router.get('/session', currentSession);
router.post('/logout', logout);

export default router;
