import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '../../src/middleware/rateLimiter.js';

describe('createRateLimiter', () => {
  it('allows the configured number of requests and rejects the next request', async () => {
    const app = express();
    app.use(createRateLimiter({ windowMs: 60000, limit: 2 }));
    app.get('/', (req, res) => res.json({ ok: true }));

    expect((await request(app).get('/')).status).toBe(200);
    expect((await request(app).get('/')).status).toBe(200);
    const limited = await request(app).get('/');
    expect(limited.status).toBe(429);
    expect(limited.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });
});
