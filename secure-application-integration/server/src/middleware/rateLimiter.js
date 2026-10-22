import { rateLimit } from 'express-rate-limit';

export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs ?? 60000;
  const limit = options.limit ?? 60;
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.'
        },
        requestId: req.id
      });
    }
  });
}
