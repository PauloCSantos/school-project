import jwt from 'jsonwebtoken';
import AuthUser from '../entity/user.entity';

type TokenDecodedProps = {
  email: string;
  role: string;
  masterId: string;
};
export default class TokenService {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

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

  async validateToken(token: string): Promise<TokenDecodedProps | null> {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenDecodedProps;
      return {
        email: decoded.email,
        role: decoded.role,
        masterId: decoded.masterId,
      };
    } catch (error) {
      //console.error('Erro ao validar token:', error);
      return null;
    }
  }

  async refreshExpiresToken(token: string): Promise<string> {
    const decoded = jwt.verify(token, this.secretKey) as TokenDecodedProps;

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
