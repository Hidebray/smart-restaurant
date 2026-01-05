
import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '../types';

interface UserJwtPayload {
  jti: string; // JWT ID
  iat: number; // Issued at
  role: UserRole;
  exp: number; // Expiration Time
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  // For local development, you can use a default secret.
  // IMPORTANT: In production, JWT_SECRET_KEY MUST be set in your environment variables.
  if (!secret) {
    if (process.env.NODE_ENV !== 'development') {
        throw new Error('JWT_SECRET_KEY is not set in environment variables for production.');
    }
    return new TextEncoder().encode('a-secure-default-secret-for-development');
  }
  return new TextEncoder().encode(secret);
};

export async function signJWT(payload: { role: UserRole }, options: { exp: string }) {
  try {
    const secret = getJwtSecretKey();
    const alg = 'HS256';
    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setJti(crypto.randomUUID())
      .sign(secret);
  } catch (error) {
    throw error;
  }
}

export async function verifyJWT(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as UserJwtPayload;
  } catch (error) {
    // This will catch expired tokens, invalid signatures, etc.
    return null;
  }
}
