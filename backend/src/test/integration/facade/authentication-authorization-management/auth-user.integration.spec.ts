import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';
import AuthUserFacadeFactory from '@/modules/authentication-authorization-management/application/factory/user-facade.factory';
import { TenantService } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';

describe('AuthUser facade integration test', () => {
  let authUserService = new AuthUserService();
  let authUserRepository = new MemoryAuthUserRepository(authUserService);
  let tenantRepository = new MemoryTenantRepository();
  let tenantService = new TenantService(tenantRepository);
  let tokenService = new TokenService('secretKey');
  let policiesService = new PoliciesService();

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

  beforeEach(() => {
    authUserService = new AuthUserService();
    authUserRepository = new MemoryAuthUserRepository(authUserService);
    tenantRepository = new MemoryTenantRepository();
    tenantService = new TenantService(tenantRepository);
    tokenService = new TokenService('secretKey');
    policiesService = new PoliciesService();
  });

  it('should create an tenant AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create(
      authUserRepository,
      authUserService,
      tenantRepository,
      tenantService,
      tokenService,
      policiesService
    );
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
    const facade = AuthUserFacadeFactory.create(
      authUserRepository,
      authUserService,
      tenantRepository,
      tenantService,
      tokenService,
      policiesService
    );
    const result = await facade.create(input, token);

    expect(result.email).toBeDefined();
  });
  it('should find an AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create(
      authUserRepository,
      authUserService,
      tenantRepository,
      tenantService,
      tokenService,
      policiesService
    );
    const result = await facade.create(input, token);
    const AuthUser = await facade.find(result, token);
    expect(AuthUser).toBeDefined();
  });
  it('should delete an AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create(
      authUserRepository,
      authUserService,
      tenantRepository,
      tenantService,
      tokenService,
      policiesService
    );
    await facade.create(input, token);
    const response = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ email: response.email }, token);

    expect(result.message).toBe('Operation completed successfully');
  });
  it('should update an  AuthUser using the facade', async () => {
    const facade = AuthUserFacadeFactory.create(
      authUserRepository,
      authUserService,
      tenantRepository,
      tenantService,
      tokenService,
      policiesService
    );
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
