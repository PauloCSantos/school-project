import TokenServiceInterface from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';

export default function tokenInstance(): TokenServiceInterface {
  const secret = 'PxHf3H7';
  const token = new TokenService(secret);
  return token;
}
