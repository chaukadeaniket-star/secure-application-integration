import { timingSafeEqual } from 'node:crypto';

export function requireReviewKey(req, res, next) {
  const expected = req.app.locals.applicationReviewKey;
  if (!expected) {
    return res.status(503).json({
      error: { code: 'REVIEW_NOT_CONFIGURED', message: 'Application review is not configured on this server.' },
      requestId: req.id
    });
  }
  const provided = req.get('x-review-key') || '';
  const expectedBytes = Buffer.from(expected);
  const providedBytes = Buffer.from(provided);
  if (providedBytes.length !== expectedBytes.length || !timingSafeEqual(providedBytes, expectedBytes)) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'A valid reviewer key is required.' },
      requestId: req.id
    });
  }
  return next();
}
