import { getSession, loginUser, registerUser, revokeSession } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.validatedBody);
    return res.status(201).json({ data: { user }, requestId: req.id });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const session = await loginUser(req.validatedBody);
    if (!session) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' },
        requestId: req.id
      });
    }
    return res.json({ data: session, requestId: req.id });
  } catch (error) {
    return next(error);
  }
}

export function currentSession(req, res) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  const user = token ? getSession(token) : null;
  if (!user) {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'A valid session is required.' },
      requestId: req.id
    });
  }
  return res.json({ data: { user }, requestId: req.id });
}

export function logout(req, res) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (token) revokeSession(token);
  return res.status(204).end();
}
