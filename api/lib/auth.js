import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_EXPIRES = '24h';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    return 'dev-jwt-secret-change-before-production';
  }
  throw new Error('JWT_SECRET environment variable is required');
}

export function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function validateAdminCredentials(username, password) {
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPlain = process.env.ADMIN_PASSWORD;

  if (username !== adminUser) return false;

  if (adminHash) {
    return bcrypt.compare(password, adminHash);
  }
  if (adminPlain) {
    return password === adminPlain;
  }
  return password === 'admin123';
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
