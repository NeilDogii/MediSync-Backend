import { Injectable } from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';

@Injectable()
export class JwtUtil {
  private readonly jwtSecret: string =
    process.env.JWT_SECRET || 'default_secret_key';

  async generateToken(
    payload: Record<string, any>,
    expiresIn: string | number = '64d',
  ): Promise<string> {
    const JWT = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(expiresIn)
      .sign(new TextEncoder().encode(this.jwtSecret));
    return JWT;
  }

  async verifyToken(token: string): Promise<object | null> {
    try {
      return await jwtVerify(token, new TextEncoder().encode(this.jwtSecret));
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
}
