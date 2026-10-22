import { createTaskSubmission, getSubmissionFile, getTaskSubmission } from '../services/submissionService.js';

function toPublicSubmission(submission) {
  if (!submission) return null;
  return {
    id: submission.id,
    taskId: submission.taskId,
    githubUrl: submission.githubUrl,
    files: submission.files.map(({ fileId, originalName, mimeType, size }) => ({ fileId, originalName, mimeType, size })),
    submittedAt: submission.submittedAt
  };
}

export async function submitTask(req, res, next) {
  try {
    const submission = await createTaskSubmission(req.user.id, req.validatedBody, req.files);
    return res.status(201).json({ data: toPublicSubmission(submission), requestId: req.id });
  } catch (error) {
    return next(error);
  }
}

export function getTaskSubmissionStatus(req, res) {
  const submission = getTaskSubmission(req.user.id, 'task-04');
  return res.json({
    data: toPublicSubmission(submission),
    requestId: req.id
  });
}

export function downloadSubmissionFile(req, res, next) {
  const file = getSubmissionFile(req.user.id, req.params.fileId);
  if (!file) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Submission file not found.' },
      requestId: req.id
    });
  }
  return res.download(file.path, file.originalName, (error) => {
    if (error && !res.headersSent) next(error);
  });
}
