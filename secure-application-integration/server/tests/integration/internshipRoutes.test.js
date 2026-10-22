import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

const app = createApp({
  env: { clientOrigin: 'http://localhost:5173', rateLimitWindowMs: 60000, rateLimitMax: 100 }
});

describe('internship routes', () => {
  it('returns internship data, metadata, request ID, and security headers', async () => {
    const response = await request(app).get('/api/internships');
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.meta.count).toBe(response.body.data.length);
    expect(response.headers['x-request-id']).toBe(response.body.requestId);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('filters results and returns an empty list for unmatched search', async () => {
    const match = await request(app).get('/api/internships?search=frontend');
    expect(match.body.data.length).toBeGreaterThan(0);
    expect(match.body.data.every((item) => `${item.title} ${item.category} ${item.skills.join(' ')}`.toLowerCase().includes('frontend'))).toBe(true);
    const iot = await request(app).get('/api/internships?category=IoT');
    expect(iot.body.data).toHaveLength(1);
    expect(iot.body.data[0].tasks).toHaveLength(4);
    expect(iot.body.meta.categories).toContain('Finance & FinTech');
    const financeSkill = await request(app).get('/api/internships?search=financial%20modeling');
    expect(financeSkill.body.data[0].id).toBe('internship-7');
    const empty = await request(app).get('/api/internships?search=no-such-role');
    expect(empty.body.data).toEqual([]);
  });

  it('returns a not-found response for unknown internship IDs', async () => {
    const response = await request(app).get('/api/internships/missing');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('REQUEST_ERROR');
  });

  it('does not allow a configured-origin mismatch to reflect an attacker origin', async () => {
    const response = await request(app).get('/api/internships').set('Origin', 'https://attacker.example');
    expect(response.headers['access-control-allow-origin']).not.toBe('https://attacker.example');
  });
});
