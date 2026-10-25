import { normalizeEmail, sanitizeText } from '../utils/sanitizeInput.js';

const limits = {
  name: 80,
  email: 254,
  phone: 24,
  college: 120,
  course: 120,
  skills: 500,
  resumeUrl: 2048,
  portfolioUrl: 2048,
  message: 1200
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[1-9][\d\s().-]*$/;

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function validateApplication(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: [{ field: 'body', message: 'A JSON object is required.' }] };
  }

  const allowedFields = new Set([
    'name', 'email', 'phone', 'college', 'course', 'skills', 'resumeUrl', 'portfolioUrl', 'message', 'internshipId'
  ]);
  for (const field of Object.keys(input)) {
    if (!allowedFields.has(field)) errors.push({ field, message: 'Unexpected field.' });
  }

  const name = typeof input.name === 'string' ? sanitizeText(input.name) : '';
  const email = typeof input.email === 'string' ? normalizeEmail(input.email) : '';
  const phone = typeof input.phone === 'string' ? sanitizeText(input.phone) : '';
  const college = typeof input.college === 'string' ? sanitizeText(input.college) : '';
  const course = typeof input.course === 'string' ? sanitizeText(input.course) : '';
  const skills = typeof input.skills === 'string' ? sanitizeText(input.skills) : '';
  const resumeUrl = typeof input.resumeUrl === 'string' ? input.resumeUrl.trim() : '';
  const portfolioUrl = typeof input.portfolioUrl === 'string' ? input.portfolioUrl.trim() : '';
  const message = typeof input.message === 'string' ? sanitizeText(input.message) : '';
  const internshipId = typeof input.internshipId === 'string' ? input.internshipId.trim() : '';

  if (name.length < 2 || name.length > limits.name) errors.push({ field: 'name', message: 'Name must be between 2 and 80 characters.' });
  if (email.length > limits.email || !emailPattern.test(email)) errors.push({ field: 'email', message: 'A valid email address is required.' });
  const phoneDigits = phone.replace(/\D/g, '');
  if (phone.length > limits.phone || !phonePattern.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.push({ field: 'phone', message: 'Enter a valid phone number with 7 to 15 digits.' });
  }
  if (college.length < 2 || college.length > limits.college) errors.push({ field: 'college', message: 'College name must be between 2 and 120 characters.' });
  if (course.length < 2 || course.length > limits.course) errors.push({ field: 'course', message: 'Course or degree must be between 2 and 120 characters.' });
  if (skills.length < 2 || skills.length > limits.skills) errors.push({ field: 'skills', message: 'Skills must be between 2 and 500 characters.' });
  if (resumeUrl.length > limits.resumeUrl || !isHttpUrl(resumeUrl)) {
    errors.push({ field: 'resumeUrl', message: 'A valid resume URL using http or https is required.' });
  }
  if (portfolioUrl.length > limits.portfolioUrl) errors.push({ field: 'portfolioUrl', message: 'Portfolio URL is too long.' });
  if (portfolioUrl) {
    if (!isHttpUrl(portfolioUrl)) {
      errors.push({ field: 'portfolioUrl', message: 'Portfolio URL must use http or https.' });
    }
  }
  if (message.length < 20 || message.length > limits.message) errors.push({ field: 'message', message: 'Message must be between 20 and 1200 characters.' });
  if (!internshipId || internshipId.length > 80) errors.push({ field: 'internshipId', message: 'A valid internship ID is required.' });

  return errors.length
    ? { valid: false, errors }
    : {
      valid: true,
      value: {
        name,
        email,
        phone: phone.replace(/[\s().-]/g, ''),
        college,
        course,
        skills,
        resumeUrl,
        portfolioUrl,
        message,
        internshipId
      }
    };
}
