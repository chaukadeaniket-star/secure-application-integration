export function validateTaskSubmission(input, { hasFiles = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: [{ field: 'body', message: 'A JSON object is required.' }] };
  }

  const errors = [];
  for (const field of Object.keys(input)) {
    if (!['taskId', 'githubUrl'].includes(field)) errors.push({ field, message: 'Unexpected field.' });
  }

  const taskId = typeof input.taskId === 'string' ? input.taskId.trim() : '';
  const githubUrl = typeof input.githubUrl === 'string' ? input.githubUrl.trim() : '';
  if (taskId !== 'task-04') errors.push({ field: 'taskId', message: 'A valid task ID is required.' });
  if (githubUrl) {
    try {
      const url = new URL(githubUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.pathname.split('/').filter(Boolean).length < 2) {
        throw new Error('Invalid repository URL.');
      }
    } catch {
      errors.push({ field: 'githubUrl', message: 'Enter a public GitHub repository URL.' });
    }
    if (githubUrl.length > 2048) errors.push({ field: 'githubUrl', message: 'GitHub repository URL is too long.' });
  } else if (!hasFiles) {
    errors.push({ field: 'proof', message: 'Provide a GitHub repository URL or upload at least one file.' });
  }

  return errors.length
    ? { valid: false, errors }
    : { valid: true, value: { taskId, githubUrl } };
}
