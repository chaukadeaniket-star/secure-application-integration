import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';

const submissions = new Map();

export async function createTaskSubmission(userId, submission, uploadedFiles = []) {
  const key = `${userId}:${submission.taskId}`;
  const previous = submissions.get(key);
  const files = uploadedFiles.length
    ? uploadedFiles.map((file) => ({
      fileId: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path
    }))
    : previous?.files || [];
  const record = {
    id: randomUUID(),
    userId,
    ...submission,
    files,
    submittedAt: new Date().toISOString()
  };
  submissions.set(key, record);
  if (uploadedFiles.length && previous?.files.length) {
    await Promise.all(previous.files.map((file) => unlink(file.path).catch((error) => {
      if (error.code !== 'ENOENT') console.error('Could not remove replaced submission file.', error);
    })));
  }
  return record;
}

export function getTaskSubmission(userId, taskId) {
  return submissions.get(`${userId}:${taskId}`) || null;
}

export function getSubmissionFile(userId, fileId) {
  for (const submission of submissions.values()) {
    if (submission.userId !== userId) continue;
    const file = submission.files.find((item) => item.fileId === fileId);
    if (file) return file;
  }
  return null;
}
