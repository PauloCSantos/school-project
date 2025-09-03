import TokenServiceInterface from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';

export default function tokenInstance(secret: string): TokenServiceInterface {
  const token = new TokenService(secret);
  return token;
}
