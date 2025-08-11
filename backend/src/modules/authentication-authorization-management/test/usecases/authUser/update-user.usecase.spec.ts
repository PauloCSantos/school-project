import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  ModulesNameEnum,
  FunctionCalledEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';

describe('UpdateAuthUser Use Case', () => {
  let authUserRepository: jest.Mocked<AuthUserGateway>;
  let tenantRepository: jest.Mocked<TenantGateway>;
  let authUserService: jest.Mocked<AuthUserServiceInterface>;
  let tenantService: jest.Mocked<TenantServiceInterface>;
  let policiesService: jest.Mocked<PoliciesServiceInterface>;
  let usecase: UpdateAuthUser;
  let token: TokenData;
  let existingUser: AuthUser;
  let partialUpdate: {
    email?: string;
    role?: RoleUsers;
    password?: string;
  };
  let targetEmail: string;

  const MockRepository = (): jest.Mocked<AuthUserGateway> => ({
    find: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    verify: jest.fn(),
  });

  const MockTenantRepository = (): jest.Mocked<TenantGateway> => ({
    create: jest.fn(),
    find: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });

  const MockAuthUserService = (): jest.Mocked<AuthUserServiceInterface> => ({
    generateHash: jest.fn(async password => `hashed_${password}`),
    comparePassword: jest.fn(async (plain, hash) => `hashed_${plain}` === hash),
  });

  const MockTenantService = (): jest.Mocked<TenantServiceInterface> => ({
    getTenant: jest.fn(),
    verifyTenantRole: jest.fn(),
    getAvailableTenantsAndRoles: jest.fn(),
    changeUserRoleInTenant: jest.fn(),
    manageUserRoleAssignmentInTenant: jest.fn(),
  });

  beforeEach(() => {
    authUserRepository = MockRepository();
    tenantRepository = MockTenantRepository();
    authUserService = MockAuthUserService();
    tenantService = MockTenantService();
    policiesService = MockPolicyService();

    usecase = new UpdateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );

    targetEmail = 'olduser@example.com';
    partialUpdate = {
      email: 'newuser@example.com',
      role: RoleUsersEnum.ADMINISTRATOR,
    };

    const idValue = new Id().value;
    token = {
      masterId: idValue,
      role: RoleUsersEnum.MASTER,
      email: 'admin@example.com',
    } as TokenData;

    existingUser = new AuthUser(
      {
        email: targetEmail,
        password: 'hashed_password',
        isHashed: true,
      },
      authUserService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when user not found', async () => {
    authUserRepository.find.mockResolvedValueOnce(null);

    await expect(
      usecase.execute(
        { email: targetEmail, authUserDataToUpdate: partialUpdate },
        token
      )
    ).rejects.toThrow('AuthUser not found');

    expect(policiesService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.UPDATE,
      token,
      { targetEmail }
    );
    expect(authUserRepository.find).toHaveBeenCalledWith(targetEmail);
    expect(authUserRepository.update).not.toHaveBeenCalled();
    expect(tenantService.getTenant).not.toHaveBeenCalled();
    expect(tenantRepository.update).not.toHaveBeenCalled();
  });

  it('should update an authUser email and role successfully', async () => {
    authUserRepository.find.mockResolvedValueOnce(existingUser);

    const tenantStub = {
      renameUserEmail: jest.fn(),
      changeTenantUserRole: jest.fn(),
    };
    tenantService.getTenant.mockResolvedValueOnce(tenantStub as any);

    authUserRepository.update.mockResolvedValueOnce({
      email: partialUpdate.email!,
      role: partialUpdate.role!,
    } as any);
    tenantRepository.update.mockResolvedValueOnce(undefined as any);

    const result = await usecase.execute(
      { email: existingUser.email, authUserDataToUpdate: partialUpdate },
      token
    );

    expect(policiesService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.UPDATE,
      token,
      { targetEmail }
    );
    expect(authUserRepository.find).toHaveBeenCalledWith(targetEmail);
    expect(tenantService.getTenant).toHaveBeenCalledWith(token.masterId);
    expect(tenantStub.renameUserEmail).toHaveBeenCalledWith(
      existingUser.email,
      partialUpdate.email
    );
    expect(tenantStub.changeTenantUserRole).toHaveBeenCalledWith(
      partialUpdate.email!,
      token.role,
      partialUpdate.role!
    );
    expect(authUserRepository.update).toHaveBeenCalledWith(
      expect.any(AuthUser),
      targetEmail
    );
    expect(tenantRepository.update).toHaveBeenCalledWith(
      token.masterId,
      tenantStub
    );
    expect(result).toEqual({
      email: partialUpdate.email,
      role: partialUpdate.role,
    });
  });

  it('should update password only and not rename or change role', async () => {
    partialUpdate = { password: 'new-password' };

    policiesService.verifyPolicies.mockResolvedValueOnce(undefined);
    authUserRepository.find.mockResolvedValueOnce(existingUser);

    const tenantStub = {
      renameUserEmail: jest.fn(),
      changeTenantUserRole: jest.fn(),
    };
    tenantService.getTenant.mockResolvedValueOnce(tenantStub as any);

    authUserRepository.update.mockResolvedValueOnce({
      email: existingUser.email,
      role: RoleUsersEnum.MASTER,
    } as any);
    tenantRepository.update.mockResolvedValueOnce(undefined as any);

    const result = await usecase.execute(
      { email: existingUser.email, authUserDataToUpdate: partialUpdate },
      token
    );

    expect(tenantService.getTenant).toHaveBeenCalledWith(token.masterId);
    expect(tenantStub.renameUserEmail).not.toHaveBeenCalled();
    expect(tenantStub.changeTenantUserRole).not.toHaveBeenCalled();
    expect(authUserRepository.update).toHaveBeenCalledWith(
      expect.any(AuthUser),
      targetEmail
    );
    expect(tenantRepository.update).toHaveBeenCalledWith(
      token.masterId,
      tenantStub
    );
    expect(result).toEqual({
      email: existingUser.email,
      role: RoleUsersEnum.MASTER,
    });
  });

  it('should propagate update errors and not swallow them', async () => {
    authUserRepository.find.mockResolvedValueOnce(existingUser);
    const tenantStub = {
      renameUserEmail: jest.fn(),
      changeTenantUserRole: jest.fn(),
    };
    tenantService.getTenant.mockResolvedValueOnce(tenantStub as any);
    authUserRepository.update.mockRejectedValueOnce(
      new Error('Update failure')
    );

    await expect(
      usecase.execute(
        { email: existingUser.email, authUserDataToUpdate: partialUpdate },
        token
      )
    ).rejects.toThrow('Update failure');

    expect(authUserRepository.update).toHaveBeenCalled();
    expect(tenantService.getTenant).toHaveBeenCalled();
    expect(tenantRepository.update).not.toHaveBeenCalled();
  });
});
