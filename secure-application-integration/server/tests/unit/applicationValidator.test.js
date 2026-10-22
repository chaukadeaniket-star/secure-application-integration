import { describe, expect, it } from 'vitest';
import { validateApplication } from '../../src/validators/applicationValidator.js';

const validApplication = {
  name: 'Aniket Chaudake',
  email: 'Aniket@example.com',
  portfolioUrl: 'https://example.com',
  message: 'I am excited to work on secure full stack applications.',
  internshipId: 'internship-1'
};

describe('validateApplication', () => {
  it('accepts valid application data and normalizes email', () => {
    const result = validateApplication(validApplication);
    expect(result.valid).toBe(true);
    expect(result.value.email).toBe('aniket@example.com');
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
