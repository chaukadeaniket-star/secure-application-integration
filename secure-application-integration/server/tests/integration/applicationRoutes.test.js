import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

const app = createApp({
  env: {
    clientOrigin: 'http://localhost:5173',
    rateLimitWindowMs: 60000,
    rateLimitMax: 100,
    applicationReviewKey: 'test-review-key'
  }
});
let token;
let userEmail;

beforeAll(async () => {
  userEmail = `application-${Date.now()}@example.com`;
  await request(app).post('/api/auth/register').send({
    name: 'Application Learner',
    email: userEmail,
    password: 'valid-password-123'
  });
  const login = await request(app).post('/api/auth/login').send({
    email: userEmail,
    password: 'valid-password-123'
  });
  token = login.body.data.token;
});

describe('application routes', () => {
  it('creates an application and does not return submitted personal information', async () => {
    const response = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({
      name: 'Aniket Chaudake',
      email: userEmail,
      phone: '+1 (415) 555-0134',
      college: 'North Valley University',
      course: 'BSc Computer Science',
      skills: 'React, Node.js, API security',
      resumeUrl: 'https://example.com/resume.pdf',
      portfolioUrl: 'https://example.com',
      message: 'I am excited to apply for this internship opportunity.',
      internshipId: 'internship-1'
    });
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeTruthy();
    expect(response.body.data.status).toBe('pending');
    expect(response.body.email).toBeUndefined();
    expect(response.body.requestId).toBe(response.headers['x-request-id']);

    const reviewQueue = await request(app).get('/api/applications/review')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Review-Key', 'test-review-key');
    const reviewedApplication = reviewQueue.body.data.find((application) => application.id === response.body.data.id);
    expect(reviewedApplication.phone).toBe('+14155550134');
    expect(reviewedApplication.college).toBe('North Valley University');
    expect(reviewedApplication.resumeUrl).toBe('https://example.com/resume.pdf');

    const mine = await request(app).get('/api/applications/mine').set('Authorization', `Bearer ${token}`);
    expect(mine.body.data).toHaveLength(1);
    expect(mine.body.data[0].status).toBe('pending');
    expect(mine.body.data[0].internship.title).toBe('Full Stack Development Intern');
  });

  it('rejects invalid payloads with field-level details', async () => {
    const response = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({
      name: 'A',
      email: 'invalid',
      phone: 'invalid',
      message: 'short',
      internshipId: 'internship-1'
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.length).toBeGreaterThan(0);
    expect(response.body.error.details.map((detail) => detail.field)).toEqual(
      expect.arrayContaining(['email', 'phone', 'college', 'course', 'skills', 'resumeUrl'])
    );
  });

  it('returns a safe client error for malformed JSON', async () => {
    const response = await request(app)
      .post('/api/applications')
      .set('Content-Type', 'application/json')
      .send('{"name":');
    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('Request body must contain valid JSON.');
    expect(response.body.requestId).toBe(response.headers['x-request-id']);
  });

  it('rejects submissions for unknown internships', async () => {
    const response = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({
      name: 'Aniket Chaudake',
      email: 'aniket@example.com',
      phone: '+14155550134',
      college: 'North Valley University',
      course: 'BSc Computer Science',
      skills: 'React and Node.js',
      resumeUrl: 'https://example.com/resume.pdf',
      message: 'I am excited to apply for this internship opportunity.',
      internshipId: 'missing'
    });
    expect(response.status).toBe(404);
  });

  it('prevents a candidate from submitting duplicate applications to the same track', async () => {
    const payload = {
      name: 'Application Learner',
      email: userEmail,
      phone: '+14155550134',
      college: 'North Valley University',
      course: 'BSc Computer Science',
      skills: 'React and Node.js',
      resumeUrl: 'https://example.com/resume.pdf',
      message: 'I would like to learn and contribute to this internship team.',
      internshipId: 'internship-3'
    };
    const first = await request(app).post('/api/applications')
      .set('Authorization', ['Bearer', token].join(' '))
      .send(payload);
    const duplicate = await request(app).post('/api/applications')
      .set('Authorization', ['Bearer', token].join(' '))
      .send(payload);

    expect(first.status).toBe(201);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.message).toContain('pending application');

    const rejected = await request(app).post(`/api/applications/${first.body.data.id}/review`)
      .set('Authorization', ['Bearer', token].join(' '))
      .set('X-Review-Key', 'test-review-key')
      .send({ status: 'rejected' });
    const resubmitted = await request(app).post('/api/applications')
      .set('Authorization', ['Bearer', token].join(' '))
      .send(payload);
    expect(rejected.status).toBe(200);
    expect(resubmitted.status).toBe(201);
  });

  it('requires the reviewer key to approve an application before the user can access an intern track', async () => {
    const submitted = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({
      name: 'Application Learner',
      email: userEmail,
      phone: '+14155550134',
      college: 'North Valley University',
      course: 'BSc Computer Science',
      skills: 'React and Node.js',
      resumeUrl: 'https://example.com/resume.pdf',
      message: 'I would like to learn and contribute to this internship team.',
      internshipId: 'internship-2'
    });
    const applicationId = submitted.body.data.id;

    const forbidden = await request(app).get('/api/applications/review')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Review-Key', 'wrong-key');
    expect(forbidden.status).toBe(403);

    const reviewList = await request(app).get('/api/applications/review')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Review-Key', 'test-review-key');
    expect(reviewList.body.data.some((application) => application.id === applicationId)).toBe(true);

    const approved = await request(app).post(`/api/applications/${applicationId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .set('X-Review-Key', 'test-review-key')
      .send({ status: 'approved' });
    expect(approved.status).toBe(200);
    expect(approved.body.data.status).toBe('approved');
    const repeatedReview = await request(app).post(`/api/applications/${applicationId}/review`)
      .set('Authorization', ['Bearer', token].join(' '))
      .set('X-Review-Key', 'test-review-key')
      .send({ status: 'rejected' });
    expect(repeatedReview.status).toBe(409);

    const mine = await request(app).get('/api/applications/mine').set('Authorization', `Bearer ${token}`);
    expect(mine.body.data.find((application) => application.id === applicationId).status).toBe('approved');
  });

  it('requires a signed-in learner to apply', async () => {
    const response = await request(app).post('/api/applications').send({
      name: 'Application Learner',
      email: userEmail,
      message: 'I would like to learn and contribute to this internship team.',
      internshipId: 'internship-1'
    });
    expect(response.status).toBe(401);
  });

  it('does not allow a configured-origin mismatch to reflect an attacker origin', async () => {
    const response = await request(app).get('/api/internships').set('Origin', 'https://attacker.example');
    expect(response.headers['access-control-allow-origin']).not.toBe('https://attacker.example');
  });
});
