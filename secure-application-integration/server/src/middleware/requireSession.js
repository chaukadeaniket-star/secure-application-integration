import { getSession } from '../services/authService.js';

export function requireSession(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  const user = token ? getSession(token) : null;
  if (!user) {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Sign in to access this feature.' },
      requestId: req.id
    });
  }
  req.user = user;
  return next();
}
