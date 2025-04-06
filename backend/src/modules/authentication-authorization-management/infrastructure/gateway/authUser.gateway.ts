import AuthUser from '@/modules/authentication-authorization-management/domain/entity/authUser.entity';

export default interface AuthUserGateway {
  find(email: string): Promise<AuthUser | undefined>;
  create(authUser: AuthUser): Promise<{ email: string; masterId: string }>;
  update(authUser: AuthUser, email: string): Promise<AuthUser>;
  delete(email: string): Promise<string>;
}
