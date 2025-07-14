import jwt from 'jsonwebtoken';
import AuthUser from '../../../authentication-authorization-management/domain/entity/user.entity';
import { TokenData } from '../../type/sharedTypes';

export default interface TokenServiceInterface {
  generateToken(
    authUser: AuthUser,
    timeToExpire?: number | string
  ): Promise<string>;
  validateToken(token: string): Promise<TokenData | null>;
  refreshExpiresToken(token: string): Promise<string>;
}
/**
 * Service responsible for generating, validating, and refreshing JWT tokens.
 */
export default class TokenService implements TokenServiceInterface {
  /**
   * Secret key used to sign and verify JWT tokens.
   */
  private readonly secretKey: string;

  /**
   * Creates an instance of TokenService.
   *
   * @param secretKey - The secret key used for signing and verifying tokens.
   */
  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  /**
   * Generates a JWT token for the authenticated user.
   *
   * @param authUser - The authenticated user containing required payload data.
   * @param timeToExpire - Optional expiration time (e.g., `'30m'`, `3600`). Defaults to 1800 seconds (30 minutes).
   * @returns A Promise that resolves to the signed JWT token.
   */
  async generateToken(
    authUser: AuthUser,
    timeToExpire?: number | string
  ): Promise<string> {
    const payload = {
      masterId: authUser.masterId,
      email: authUser.email,
      role: authUser.role,
    };

    const options = {
      expiresIn: timeToExpire ? timeToExpire : 1800,
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  /**
   * Validates a JWT token and returns the decoded payload if valid.
   *
   * @param token - The JWT token to validate.
   * @returns A Promise that resolves to the decoded token payload if valid, or `null` if invalid or expired.
   */
  async validateToken(token: string): Promise<TokenData | null> {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenData;
      return {
        email: decoded.email,
        role: decoded.role,
        masterId: decoded.masterId,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Refreshes the expiration time of a valid JWT token.
   *
   * @param token - The existing JWT token to refresh.
   * @returns A Promise that resolves to a new JWT token with updated expiration time.
   */
  async refreshExpiresToken(token: string): Promise<string> {
    const decoded = jwt.verify(token, this.secretKey) as TokenData;

    const payload = {
      masterId: decoded.masterId,
      email: decoded.email,
      role: decoded.role,
    };

    const options = {
      expiresIn: '30m',
    };

    return jwt.sign(payload, this.secretKey, options);
  }
}
