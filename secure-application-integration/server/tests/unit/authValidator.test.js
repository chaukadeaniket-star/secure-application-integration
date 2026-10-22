import { describe, expect, it } from 'vitest';
import { validateLogin, validateRegistration } from '../../src/validators/authValidator.js';
import { validateTaskSubmission } from '../../src/validators/submissionValidator.js';

describe('authentication and task submission validation', () => {
  it('normalizes registration email and rejects weak passwords', () => {
    const valid = validateRegistration({ name: 'Test Learner', email: 'TEST@Example.com', password: 'password-123' });
    expect(valid.valid).toBe(true);
    expect(valid.value.email).toBe('test@example.com');
    expect(validateLogin({ email: 'test@example.com', password: 'short' }).valid).toBe(false);
  });

  it('accepts only a GitHub repository URL for the current task', () => {
    expect(validateTaskSubmission({ taskId: 'task-04', githubUrl: 'https://github.com/user/repo' }).valid).toBe(true);
    expect(validateTaskSubmission({ taskId: 'task-04', githubUrl: '' }, { hasFiles: true }).valid).toBe(true);
    expect(validateTaskSubmission({ taskId: 'task-04', githubUrl: '' }).valid).toBe(false);
    expect(validateTaskSubmission({ taskId: 'task-04', githubUrl: 'javascript:alert(1)' }).valid).toBe(false);
    expect(validateTaskSubmission({ taskId: 'task-05', githubUrl: 'https://github.com/user/repo' }).valid).toBe(false);
  });
});
