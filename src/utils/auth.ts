import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
interface User {
  userId: string;
  role: string;
}

export function signJWT(userId: string, role: string) {
  const payload = { userId, role };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

type VerifyJWTResult =
  | {
      error: false;
      userId: string;
      role: string;
    }
  | {
      error: true;
      userId: null;
      role: null;
    };

export function verifyJWT(token: string): VerifyJWTResult {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    return { error: false, userId: decoded.userId, role: decoded.role };
  } catch {
    return { error: true, userId: null, role: null };
  }
}
