import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';
import AuthUser from '../../entity/user.entity';

export default interface TokenServiceInterface {
  generateToken(
    authUser: AuthUser,
    id: string,
    role: RoleUsers,
    timeToExpire?: number | string
  ): Promise<string>;
  validateToken(token: string): Promise<TokenData | null>;
  refreshExpiresToken(token: string): Promise<string>;
}
