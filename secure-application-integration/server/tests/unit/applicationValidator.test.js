import { describe, expect, it } from 'vitest';
import { validateApplication } from '../../src/validators/applicationValidator.js';

const validApplication = {
  name: 'Aniket Chaudake',
  email: 'Aniket@example.com',
  phone: '+1 (415) 555-0134',
  college: 'North Valley University',
  course: 'BSc Computer Science',
  skills: 'React, Node.js, API security',
  resumeUrl: 'https://example.com/resume.pdf',
  portfolioUrl: 'https://example.com',
  message: 'I am excited to work on secure full stack applications.',
  internshipId: 'internship-1'
};

describe('validateApplication', () => {
  it('accepts valid application data and normalizes email', () => {
    const result = validateApplication(validApplication);
    expect(result.valid).toBe(true);
    expect(result.value.email).toBe('aniket@example.com');
    expect(result.value.phone).toBe('+14155550134');
  });

  it('rejects malformed email, short message, and unsupported URL protocols', () => {
    const result = validateApplication({
      ...validApplication,
      email: 'not-an-email',
      portfolioUrl: 'javascript:alert(1)',
      message: 'Too short'
    });
    expect(result.valid).toBe(false);
    expect(result.errors.map((error) => error.field)).toEqual(expect.arrayContaining(['email', 'portfolioUrl', 'message']));
  });

  it('rejects malformed phone numbers, missing education details, and unsafe resume URLs', () => {
    const result = validateApplication({
      ...validApplication,
      phone: 'call me',
      college: '',
      course: 'x',
      resumeUrl: 'javascript:alert(1)'
    });
    expect(result.valid).toBe(false);
    expect(result.errors.map((error) => error.field)).toEqual(expect.arrayContaining(['phone', 'college', 'course', 'resumeUrl']));
  });

  it('rejects unknown fields and sanitizes control characters and markup', () => {
    const result = validateApplication({ ...validApplication, name: ' <A>\nniket ', extra: 'unexpected' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === 'extra')).toBe(true);
  });

  it('rejects non-object request bodies', () => {
    expect(validateApplication(null).valid).toBe(false);
    expect(validateApplication([]).valid).toBe(false);
  });
});
