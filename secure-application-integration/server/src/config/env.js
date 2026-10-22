function positiveInteger(value, fallback, name) {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return parsed;
}

export function loadEnv(source = process.env) {
  const nodeEnv = source.NODE_ENV || 'development';
  const port = positiveInteger(source.PORT, 4000, 'PORT');
  const rateLimitWindowMs = positiveInteger(source.RATE_LIMIT_WINDOW_MS, 60000, 'RATE_LIMIT_WINDOW_MS');
  const rateLimitMax = positiveInteger(source.RATE_LIMIT_MAX, 60, 'RATE_LIMIT_MAX');
  const applicationReviewKey = source.APPLICATION_REVIEW_KEY
    || (nodeEnv === 'development' ? 'local-review-only' : '');
  const clientOrigin = source.CLIENT_ORIGIN || 'http://localhost:5173';
  try {
    new URL(clientOrigin);
  } catch {
    throw new Error('CLIENT_ORIGIN must be a valid URL.');
  }
  return { nodeEnv, port, rateLimitWindowMs, rateLimitMax, clientOrigin, applicationReviewKey };
}

export const env = loadEnv();
