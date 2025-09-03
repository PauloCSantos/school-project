import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';
import AuthUserFacadeFactory from '@/modules/authentication-authorization-management/application/factory/user-facade.factory';

describe('AuthUser facade integration test', () => {
  const input = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    role: 'worker' as RoleUsers,
    cnpj: '12345678000195',
  };
  const input2 = {
    email: 'teste2@teste.com.br',
    password: 'XpA2Jjd4',
    role: 'administrator' as RoleUsers,
    cnpj: '12345678000111',
  };
  const input3 = {
    email: 'teste3@teste.com.br',
    password: 'XpA2Jjd4',
    role: 'student' as RoleUsers,
    cnpj: '12345678000234',
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  it('should create an tenant AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create();
    const result = await facade.createTenant({
      email: 'teste3@teste.com.br',
      password: 'XpA2Jjd4',
      role: 'master' as RoleUsers,
      cnpj: '12345678000234',
    });

    expect(result.email).toBeDefined();
    expect(result.masterId).toBeDefined();
  });
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

    expect(result.message).toBe('Operation completed successfully');
  });
  it('should update an  AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create();
    const response = await facade.create(input, token);

    token.masterId = response.masterId;
    const result = await facade.update(
      {
        email: response.email,
        authUserDataToUpdate: { email: 'newemail@teste.com' },
      },
      token
    );

    expect(result).toBeDefined();
  });
});
