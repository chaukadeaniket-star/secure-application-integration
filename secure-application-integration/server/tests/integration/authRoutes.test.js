import request from 'supertest';
import { unlink } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { getSubmissionFile } from '../../src/services/submissionService.js';

const app = createApp({
  env: { clientOrigin: 'http://localhost:5173', rateLimitWindowMs: 60000, rateLimitMax: 100 }
});

describe('authentication routes', () => {
  it('allows the frontend to send session credentials on cross-origin requests', async () => {
    const response = await request(app)
      .options('/api/submissions')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'authorization,content-type');
    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-headers']).toContain('Authorization');
  });

  it('registers an account, requires login, and validates the resulting session', async () => {
    const email = `learner-${Date.now()}@example.com`;
    const registration = await request(app).post('/api/auth/register').send({
      name: 'Test Learner',
      email,
      password: 'valid-password-123'
    });
    expect(registration.status).toBe(201);
    expect(registration.body.data.user.email).toBe(email);
    expect(registration.body.data.user.password).toBeUndefined();

    const duplicate = await request(app).post('/api/auth/register').send({
      name: 'Test Learner',
      email,
      password: 'valid-password-123'
    });
    expect(duplicate.status).toBe(409);

    const badLogin = await request(app).post('/api/auth/login').send({
      email,
      password: 'incorrect-password'
    });
    expect(badLogin.status).toBe(401);

    const login = await request(app).post('/api/auth/login').send({
      email,
      password: 'valid-password-123'
    });
    expect(login.status).toBe(200);
    expect(login.body.data.token).toBeTruthy();

    const session = await request(app)
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${login.body.data.token}`);
    expect(session.status).toBe(200);
    expect(session.body.data.user.name).toBe('Test Learner');

    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${login.body.data.token}`);
    expect(logout.status).toBe(204);
    const expiredSession = await request(app)
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${login.body.data.token}`);
    expect(expiredSession.status).toBe(401);
  });

  it('accepts task submissions only from a session and validates the GitHub URL', async () => {
    const email = `submission-${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      name: 'Submission Learner',
      email,
      password: 'valid-password-123'
    });
    const login = await request(app).post('/api/auth/login').send({
      email,
      password: 'valid-password-123'
    });
    const token = login.body.data.token;

    const unauthenticated = await request(app).post('/api/submissions').send({
      taskId: 'task-04',
      githubUrl: 'https://github.com/learner/project'
    });
    expect(unauthenticated.status).toBe(401);

    const invalid = await request(app).post('/api/submissions')
      .set('Authorization', `Bearer ${token}`)
      .send({ taskId: 'task-04', githubUrl: 'https://example.com/project' });
    expect(invalid.status).toBe(400);

    const submitted = await request(app).post('/api/submissions')
      .set('Authorization', `Bearer ${token}`)
      .send({ taskId: 'task-04', githubUrl: 'https://github.com/learner/project' });
    expect(submitted.status).toBe(201);
    expect(submitted.body.data.githubUrl).toBe('https://github.com/learner/project');

    const status = await request(app).get('/api/submissions/task-04')
      .set('Authorization', `Bearer ${token}`);
    expect(status.body.data.id).toBe(submitted.body.data.id);
  });

  it('uploads allowed submission files and serves them only to their owner', async () => {
    const email = `upload-${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      name: 'Upload Learner',
      email,
      password: 'valid-password-123'
    });
    const login = await request(app).post('/api/auth/login').send({
      email,
      password: 'valid-password-123'
    });
    const token = login.body.data.token;
    const content = Buffer.from('Task test report: all checks passed.');

    const uploaded = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${token}`)
      .field('taskId', 'task-04')
      .attach('files', content, { filename: 'test-report.txt', contentType: 'text/plain' });

    expect(uploaded.status).toBe(201);
    expect(uploaded.body.data.githubUrl).toBe('');
    expect(uploaded.body.data.files).toHaveLength(1);
    expect(uploaded.body.data.files[0].originalName).toBe('test-report.txt');

    const downloaded = await request(app)
      .get(`/api/submissions/files/${encodeURIComponent(uploaded.body.data.files[0].fileId)}`)
      .set('Authorization', `Bearer ${token}`);
    expect(downloaded.status).toBe(200);
    expect(downloaded.text).toBe(content.toString());

    const oversized = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${token}`)
      .field('taskId', 'task-04')
      .attach('files', Buffer.alloc(10 * 1024 * 1024 + 1), { filename: 'too-large.txt', contentType: 'text/plain' });
    expect(oversized.status).toBe(413);

    const otherAccount = `other-${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      name: 'Other Learner',
      email: otherAccount,
      password: 'valid-password-123'
    });
    const otherLogin = await request(app).post('/api/auth/login').send({
      email: otherAccount,
      password: 'valid-password-123'
    });
    const forbiddenDownload = await request(app)
      .get(`/api/submissions/files/${encodeURIComponent(uploaded.body.data.files[0].fileId)}`)
      .set('Authorization', `Bearer ${otherLogin.body.data.token}`);
    expect(forbiddenDownload.status).toBe(404);

    const storedFile = getSubmissionFile(login.body.data.user.id, uploaded.body.data.files[0].fileId);
    await unlink(storedFile.path);
  });

  it('rejects unsupported submission file types', async () => {
    const email = `bad-upload-${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      name: 'Upload Learner',
      email,
      password: 'valid-password-123'
    });
    const login = await request(app).post('/api/auth/login').send({
      email,
      password: 'valid-password-123'
    });
    const response = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${login.body.data.token}`)
      .field('taskId', 'task-04')
      .attach('files', Buffer.from('not an executable we accept'), { filename: 'program.exe', contentType: 'application/octet-stream' });
    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain('Upload a PDF');
  });
});
