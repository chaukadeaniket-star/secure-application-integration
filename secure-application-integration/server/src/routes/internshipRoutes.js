import { Router } from 'express';
import { getInternship, getInternships } from '../controllers/internshipController.js';

const router = Router();
router.get('/', getInternships);
router.get('/:id', getInternship);
export default router;
