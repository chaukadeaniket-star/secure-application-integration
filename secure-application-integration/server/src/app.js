import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import applicationRoutes from './routes/applicationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { requestId } from './middleware/requestId.js';

export function createApp(options = {}) {
  const app = express();
  const appEnv = options.env || env;
  app.locals.applicationReviewKey = appEnv.applicationReviewKey || '';
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin: appEnv.clientOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Review-Key'],
    exposedHeaders: ['X-Request-Id']
  }));
  app.use(requestId);
  app.use(express.json({ limit: '16kb', strict: true }));
  app.use('/api', createRateLimiter({
    windowMs: appEnv.rateLimitWindowMs,
    limit: appEnv.rateLimitMax
  }));
  app.get('/api/health', (req, res) => res.json({ status: 'ok', requestId: req.id }));
  app.use('/api/auth', authRoutes);
  app.use('/api/internships', internshipRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

export default createApp();
