import AddRole from '@/modules/authentication-authorization-management/application/usecases/authUser/add-role.usecase';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import { AddRoleInputDto } from '@/modules/authentication-authorization-management/application/dto/user-usecase.dto';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';
import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import { AcessDeniedError } from '@/modules/@shared/application/errors/access-denied.error';
import { AuthUserNotFoundError } from '@/modules/authentication-authorization-management/application/errors/auth-user-not-found.error';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('AddRole Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let tenantRepository: jest.Mocked<TenantGateway>;
  let policiesService: jest.Mocked<PoliciesServiceInterface>;
  let tenantService: jest.Mocked<TenantServiceInterface>;
  let usecase: AddRole;
  let input: AddRoleInputDto;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<AuthUserGateway> => ({
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    verify: jest.fn(),
  });

  const MockTenantRepository = (): jest.Mocked<TenantGateway> => ({
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn(),
  });

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });

  const MockTenantService = (): jest.Mocked<TenantServiceInterface> => ({
    manageUserRoleAssignmentInTenant: jest.fn(),
    changeUserRoleInTenant: jest.fn(),
    getAvailableTenantsAndRoles: jest.fn(),
    getTenant: jest.fn(),
    verifyTenantRole: jest.fn(),
  });

  beforeEach(() => {
    repository = MockRepository();
    tenantRepository = MockTenantRepository();
    policiesService = MockPolicyService();
    tenantService = MockTenantService();

    usecase = new AddRole(repository, tenantRepository, tenantService, policiesService);

    input = {
      email: 'john.doe@example.com',
      role: RoleUsersEnum.STUDENT,
    } as AddRoleInputDto;

    token = {
      masterId: 'tenant-123',
      email: 'teste@teste.com',
      role: RoleUsersEnum.MASTER,
    };
  });

  it('should verify policies and add role to tenant', async () => {
    policiesService.verifyPolicies.mockResolvedValueOnce();
    repository.find.mockResolvedValueOnce({ email: input.email } as any);

    const tenantMock = {
      id: 'tenant-123',
      addTenantUserRole: jest.fn(),
    } as unknown as Tenant;
    tenantService.getTenant.mockResolvedValueOnce(tenantMock);

    await usecase.execute(input, token);

    expect(policiesService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.ADD,
      token,
      { targetRole: 'student' }
    );
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(tenantService.getTenant).toHaveBeenCalledWith(token.masterId);
    expect(tenantMock.addTenantUserRole).toHaveBeenCalledWith(input.email, input.role);
    expect(tenantRepository.update).toHaveBeenCalledWith(tenantMock.id, tenantMock);
  });

  it('should throw access denied and not touch repositories', async () => {
    policiesService.verifyPolicies.mockRejectedValueOnce(
      new AcessDeniedError('User does not have access permission')
    );

    await expect(usecase.execute(input, token)).rejects.toThrow(
      'User does not have access permission'
    );

    expect(repository.find).not.toHaveBeenCalled();
    expect(tenantService.getTenant).not.toHaveBeenCalled();
    expect(tenantRepository.update).not.toHaveBeenCalled();
  });

  it('should throw AuthUserNotFoundError if user is not found', async () => {
    policiesService.verifyPolicies.mockResolvedValueOnce();
    repository.find.mockResolvedValueOnce(null);

    await expect(usecase.execute(input, token)).rejects.toThrow(AuthUserNotFoundError);

    expect(tenantService.getTenant).not.toHaveBeenCalled();
    expect(tenantRepository.update).not.toHaveBeenCalled();
  });
});
