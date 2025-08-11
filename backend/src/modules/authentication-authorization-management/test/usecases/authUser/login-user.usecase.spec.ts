import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import TokenServiceInterface from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { LoginAuthUserInputDto } from '@/modules/authentication-authorization-management/application/dto/user-usecase.dto';
import AuthUser, {
  AuthUserProps,
} from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('LoginAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let authUserService: jest.Mocked<AuthUserServiceInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;
  let tenantService: jest.Mocked<TenantServiceInterface>;
  let usecase: LoginAuthUser;
  let input: LoginAuthUserInputDto;
  let existingUserProps: AuthUserProps;

  beforeEach(() => {
    repository = {
      find: jest.fn(),
    } as any;

    authUserService = {
      comparePassword: jest.fn(),
    } as any;

    tokenService = {
      generateToken: jest.fn(),
    } as any;

    tenantService = {
      verifyTenantRole: jest.fn(),
      getAvailableTenantsAndRoles: jest.fn(),
    } as any;

    usecase = new LoginAuthUser(
      repository,
      authUserService,
      tokenService,
      tenantService
    );

    input = {
      email: 'user@example.com',
      password: 'plain-password',
    };

    existingUserProps = {
      email: 'user@example.com',
      password: 'hashed-password',
      isHashed: true,
    };
  });

  it('should throw error when user not found', async () => {
    repository.find.mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(
      'Invalid credentials. Please check your email and password and try again'
    );

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(authUserService.comparePassword).not.toHaveBeenCalled();
    expect(tokenService.generateToken).not.toHaveBeenCalled();
    expect(tenantService.getAvailableTenantsAndRoles).not.toHaveBeenCalled();
    expect(tenantService.verifyTenantRole).not.toHaveBeenCalled();
  });

  it('should return available tenants and roles when no tenantId and role provided', async () => {
    repository.find.mockResolvedValue(existingUserProps as any);
    authUserService.comparePassword.mockResolvedValue(true);

    const stubData = [
      {
        id: 'tenant1',
        roles: [RoleUsersEnum.ADMINISTRATOR, RoleUsersEnum.MASTER],
      },
      { id: 'tenant2', roles: [RoleUsersEnum.MASTER] },
    ];
    tenantService.getAvailableTenantsAndRoles.mockResolvedValue(stubData);

    const output = await usecase.execute(input);

    expect(output).toEqual({ data: stubData });
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(authUserService.comparePassword).toHaveBeenCalledWith(
      input.password,
      existingUserProps.password
    );
    expect(tokenService.generateToken).not.toHaveBeenCalled();
    expect(tenantService.getAvailableTenantsAndRoles).toHaveBeenCalledWith(
      input.email
    );
    expect(tenantService.verifyTenantRole).not.toHaveBeenCalled();
  });

  it('should generate token when tenantId and role provided', async () => {
    const masterId = 'master-123';
    const role = RoleUsersEnum.ADMINISTRATOR;
    const tokenValue = 'fake-jwt-token';

    repository.find.mockResolvedValue(existingUserProps as any);
    authUserService.comparePassword.mockResolvedValue(true);
    tenantService.verifyTenantRole.mockResolvedValue(undefined);
    tokenService.generateToken.mockResolvedValue(tokenValue);

    const output = await usecase.execute({
      email: input.email,
      password: input.password,
      masterId,
      role,
    });

    expect(output).toEqual({ token: tokenValue });
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(authUserService.comparePassword).toHaveBeenCalledWith(
      input.password,
      existingUserProps.password
    );
    expect(tenantService.verifyTenantRole).toHaveBeenCalledWith(
      masterId,
      input.email,
      role
    );
    expect(tokenService.generateToken).toHaveBeenCalledWith(
      expect.any(AuthUser),
      masterId,
      role
    );
    expect(tenantService.getAvailableTenantsAndRoles).not.toHaveBeenCalled();
  });

  it('should throw error when password is invalid', async () => {
    repository.find.mockResolvedValue(existingUserProps as any);
    authUserService.comparePassword.mockResolvedValue(false);

    await expect(usecase.execute(input)).rejects.toThrow(
      'Invalid credentials. Please check your email and password and try again'
    );

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(authUserService.comparePassword).toHaveBeenCalledWith(
      input.password,
      existingUserProps.password
    );
    expect(tokenService.generateToken).not.toHaveBeenCalled();
    expect(tenantService.getAvailableTenantsAndRoles).not.toHaveBeenCalled();
    expect(tenantService.verifyTenantRole).not.toHaveBeenCalled();
  });
});
