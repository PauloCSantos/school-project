import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import { CreateAuthUserInputDto } from '@/modules/authentication-authorization-management/application/dto/user-usecase.dto';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';
import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';

describe('CreateAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let tenantRepository: jest.Mocked<TenantGateway>;
  let authUserService: jest.Mocked<AuthUserServiceInterface>;
  let tenantService: jest.Mocked<TenantServiceInterface>;
  let policiesService: jest.Mocked<PoliciesServiceInterface>;
  let usecase: CreateAuthUser;
  let input: CreateAuthUserInputDto;

  const makeDefaultInput = (): CreateAuthUserInputDto => ({
    email: 'test@domain.com',
    password: 'Pass123!',
    role: RoleUsersEnum.MASTER,
    cnpj: '12345678000195',
  });

  const MockRepository = (): jest.Mocked<AuthUserGateway> => ({
    find: jest.fn(),
    create: jest.fn(async authUser => ({
      email: authUser.email,
    })),
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

  const MockAuthUserService = (): jest.Mocked<AuthUserServiceInterface> => ({
    generateHash: jest.fn(async password => `hashed_${password}`),
    comparePassword: jest.fn(async (plain, hash) => `hashed_${plain}` === hash),
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
    authUserService = MockAuthUserService();
    tenantService = MockTenantService();
    policiesService = MockPolicyService();
    usecase = new CreateAuthUser(
      repository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    input = makeDefaultInput();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw access denied if policy denies', async () => {
    policiesService.verifyPolicies.mockRejectedValueOnce(
      new Error('User does not have access permission')
    );
    input.role = RoleUsersEnum.ADMINISTRATOR;
    await expect(usecase.execute(input)).rejects.toThrow(
      'User does not have access permission'
    );

    expect(policiesService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.CREATE,
      undefined,
      { targetRole: input.role }
    );
  });

  it('should create a user and return the result when permitted', async () => {
    repository.find.mockResolvedValueOnce(null);
    tenantService.manageUserRoleAssignmentInTenant.mockResolvedValueOnce({
      tenant: { id: 'tenant-id' } as Tenant,
      isNew: true,
    });

    const output = await usecase.execute(input);

    expect(authUserService.generateHash).toHaveBeenCalledWith(input.password);
    expect(repository.create).toHaveBeenCalled();

    expect(tenantService.manageUserRoleAssignmentInTenant).toHaveBeenCalledWith({
      masterId: undefined,
      email: input.email,
      role: input.role,
      cnpj: input.cnpj,
    });
    expect(tenantRepository.create).toHaveBeenCalledWith({ id: 'tenant-id' });
    expect(output.email).toBe(input.email);
    expect(output.masterId).toBe('tenant-id');
  });

  it('should throw if user already exists', async () => {
    repository.find.mockResolvedValueOnce({
      email: input.email,
      comparePassword: jest.fn().mockReturnValueOnce(false),
    } as any);

    await expect(usecase.execute(input)).rejects.toThrow('E-mail já utilizado');

    expect(repository.create).not.toHaveBeenCalled();
    expect(tenantService.manageUserRoleAssignmentInTenant).not.toHaveBeenCalled();
  });

  it('should propagate hash errors and not call create', async () => {
    repository.find.mockResolvedValueOnce(null);
    authUserService.generateHash.mockRejectedValueOnce(
      new Error('User does not have access permission')
    );

    await expect(usecase.execute(input)).rejects.toThrow(
      'User does not have access permission'
    );
    expect(repository.create).not.toHaveBeenCalled();
    expect(tenantService.manageUserRoleAssignmentInTenant).not.toHaveBeenCalled();
  });
});
