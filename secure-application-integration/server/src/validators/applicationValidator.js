import { normalizeEmail, sanitizeText } from '../utils/sanitizeInput.js';

const limits = { name: 80, email: 254, portfolioUrl: 2048, message: 1200 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateApplication(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: [{ field: 'body', message: 'A JSON object is required.' }] };
  }

  const allowedFields = new Set(['name', 'email', 'portfolioUrl', 'message', 'internshipId']);
  for (const field of Object.keys(input)) {
    if (!allowedFields.has(field)) errors.push({ field, message: 'Unexpected field.' });
  }

  const name = typeof input.name === 'string' ? sanitizeText(input.name) : '';
  const email = typeof input.email === 'string' ? normalizeEmail(input.email) : '';
  const portfolioUrl = typeof input.portfolioUrl === 'string' ? input.portfolioUrl.trim() : '';
  const message = typeof input.message === 'string' ? sanitizeText(input.message) : '';
  const internshipId = typeof input.internshipId === 'string' ? input.internshipId.trim() : '';

  if (name.length < 2 || name.length > limits.name) errors.push({ field: 'name', message: 'Name must be between 2 and 80 characters.' });
  if (email.length > limits.email || !emailPattern.test(email)) errors.push({ field: 'email', message: 'A valid email address is required.' });
  if (portfolioUrl.length > limits.portfolioUrl) errors.push({ field: 'portfolioUrl', message: 'Portfolio URL is too long.' });
  if (portfolioUrl) {
    try {
      const url = new URL(portfolioUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol.');
    } catch {
      errors.push({ field: 'portfolioUrl', message: 'Portfolio URL must use http or https.' });
    }
  }
  if (message.length < 20 || message.length > limits.message) errors.push({ field: 'message', message: 'Message must be between 20 and 1200 characters.' });
  if (!internshipId || internshipId.length > 80) errors.push({ field: 'internshipId', message: 'A valid internship ID is required.' });

  return errors.length
    ? { valid: false, errors }
    : { valid: true, value: { name, email, portfolioUrl, message, internshipId } };
}
