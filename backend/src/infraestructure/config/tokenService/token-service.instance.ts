import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';

export default function tokenInstance(): TokenService {
  const secret = 'PxHf3H7';
  const token = new TokenService(secret);
  return token;
}
