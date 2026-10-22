import { Router } from 'express';
import { downloadSubmissionFile, getTaskSubmissionStatus, submitTask } from '../controllers/submissionController.js';
import { unlink } from 'node:fs/promises';
import { requireSession } from '../middleware/requireSession.js';
import { submissionUpload } from '../middleware/submissionUpload.js';
import { getTaskSubmission } from '../services/submissionService.js';
import { validateTaskSubmission } from '../validators/submissionValidator.js';

const router = Router();
router.use(requireSession);
router.get('/task-04', getTaskSubmissionStatus);
router.get('/files/:fileId', downloadSubmissionFile);
router.post('/', submissionUpload, async (req, res, next) => {
  const files = req.files || [];
  req.files = files;
  const existingFiles = getTaskSubmission(req.user.id, 'task-04')?.files.length > 0;
  const result = validateTaskSubmission(req.body, { hasFiles: files.length > 0 || existingFiles });
  if (!result.valid) {
    await Promise.all(req.files.map((file) => unlink(file.path).catch((error) => {
      if (error.code !== 'ENOENT') console.error('Could not remove invalid submission upload.', error);
    })));
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Please correct the invalid fields.', details: result.errors },
      requestId: req.id
    });
  }
  req.validatedBody = result.value;
  return next();
}, submitTask);

export default router;
