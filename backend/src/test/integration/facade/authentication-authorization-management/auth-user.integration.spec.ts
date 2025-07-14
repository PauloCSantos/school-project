import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';
import AuthUserFacadeFactory from '@/modules/authentication-authorization-management/application/factory/user-facade.factory';

describe('AuthUser facade integration test', () => {
  const input = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().value,
    role: 'master' as RoleUsers,
    isHashed: false,
  };
  const input2 = {
    email: 'teste2@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().value,
    role: 'administrator' as RoleUsers,
    isHashed: false,
  };
  const input3 = {
    email: 'teste3@teste.com.br',
    password: 'XpA2Jjd4',
    role: 'master' as RoleUsers,
    isHashed: false,
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: 'master',
  };

  it('should create an AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.email).toBeDefined();
  });
  it('should find an AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create();
    const result = await facade.create(input, token);
    const AuthUser = await facade.find(result, token);

    expect(AuthUser).toBeDefined();
  });
  it('should delete an AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create();
    await facade.create(input, token);
    const response = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ email: response.email }, token);

    expect(result.message).toBe('Operação concluída com sucesso');
  });
  it('should update an  AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create();
    const response = await facade.create(input, token);

    const result = await facade.update(
      {
        authUserDataToUpdate: { email: 'newemail@teste.com' },
        email: response.email,
      },
      token
    );

    expect(result).toBeDefined();
  });
});
