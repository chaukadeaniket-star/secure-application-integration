import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const usersByEmail = new Map();
const sessions = new Map();

export async function registerUser({ name, email, password }) {
  if (usersByEmail.has(email)) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const salt = randomBytes(16).toString('hex');
  const passwordHash = await scrypt(password, salt, 64);
  const user = { id: randomBytes(16).toString('hex'), name, email, salt, passwordHash };
  usersByEmail.set(email, user);
  return { id: user.id, name: user.name, email: user.email };
}

export async function loginUser({ email, password }) {
  const user = usersByEmail.get(email);
  if (!user) return null;

  const candidateHash = await scrypt(password, user.salt, 64);
  if (!timingSafeEqual(user.passwordHash, candidateHash)) return null;

  const token = randomBytes(32).toString('hex');
  sessions.set(token, { id: user.id, name: user.name, email: user.email });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export function getSession(token) {
  return sessions.get(token) || null;
}

export function revokeSession(token) {
  return sessions.delete(token);
}
