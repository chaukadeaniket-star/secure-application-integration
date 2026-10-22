import { normalizeEmail, sanitizeText } from '../utils/sanitizeInput.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(input, includeName) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: [{ field: 'body', message: 'A JSON object is required.' }] };
  }

  const allowedFields = new Set(includeName ? ['name', 'email', 'password'] : ['email', 'password']);
  for (const field of Object.keys(input)) {
    if (!allowedFields.has(field)) errors.push({ field, message: 'Unexpected field.' });
  }

  const name = typeof input.name === 'string' ? sanitizeText(input.name) : '';
  const email = typeof input.email === 'string' ? normalizeEmail(input.email) : '';
  const password = typeof input.password === 'string' ? input.password : '';
  if (includeName && (name.length < 2 || name.length > 80)) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 80 characters.' });
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  }
  if (password.length < 8 || password.length > 128) {
    errors.push({ field: 'password', message: 'Password must be between 8 and 128 characters.' });
  }

  return errors.length
    ? { valid: false, errors }
    : { valid: true, value: includeName ? { name, email, password } : { email, password } };
}

export function validateRegistration(input) {
  return validateCredentials(input, true);
}

export function validateLogin(input) {
  return validateCredentials(input, false);
}
