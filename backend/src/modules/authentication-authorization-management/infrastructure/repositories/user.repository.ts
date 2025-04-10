import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '../gateway/user.gateway';

export default class MemoryAuthUserRepository implements AuthUserGateway {
  private _authUser: AuthUser[];

  constructor(authUser?: AuthUser[]) {
    authUser ? (this._authUser = authUser) : (this._authUser = []);
  }

  async find(email: string): Promise<AuthUser | undefined> {
    const authUser = this._authUser.find(authUser => authUser.email === email);
    if (authUser) {
      return authUser;
    } else {
      return undefined;
    }
  }
  async create(
    authUser: AuthUser
  ): Promise<{ email: string; masterId: string }> {
    this._authUser.push(authUser);
    return { email: authUser.email, masterId: authUser.masterId };
  }
  async update(authUser: AuthUser, email: string): Promise<AuthUser> {
    const authUserIndex = this._authUser.findIndex(
      dbAuthUser => dbAuthUser.email === email
    );
    if (authUserIndex !== -1) {
      return (this._authUser[authUserIndex] = authUser);
    } else {
      throw new Error('AuthUser not found');
    }
  }
  async delete(email: string): Promise<string> {
    const authUserIndex = this._authUser.findIndex(
      dbAuthUser => dbAuthUser.email === email
    );
    if (authUserIndex !== -1) {
      this._authUser.splice(authUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('AuthUser not found');
    }
  }
}
