import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import TokenServiceInterface from '@/modules/@shared/infraestructure/services/token.service';
import { LoginAuthUserInputDto } from '@/modules/authentication-authorization-management/application/dto/user-usecase.dto';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUser, {
  AuthUserProps,
} from '@/modules/authentication-authorization-management/domain/entity/user.entity';

describe('LoginAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let authUserService: jest.Mocked<AuthUserServiceInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;
  let usecase: LoginAuthUser;
  let input: LoginAuthUserInputDto;
  let existingUser: AuthUserProps;

  const MockRepository = (): jest.Mocked<AuthUserGateway> =>
    ({
      find: jest.fn(),
    }) as unknown as jest.Mocked<AuthUserGateway>;

  const MockAuthUserService = (): jest.Mocked<AuthUserServiceInterface> =>
    ({
      comparePassword: jest.fn(),
    }) as unknown as jest.Mocked<AuthUserServiceInterface>;

  const MockTokenService = (): jest.Mocked<TokenServiceInterface> =>
    ({
      generateToken: jest.fn(),
    }) as unknown as jest.Mocked<TokenServiceInterface>;

  beforeEach(() => {
    repository = MockRepository();
    authUserService = MockAuthUserService();
    tokenService = MockTokenService();
    usecase = new LoginAuthUser(repository, authUserService, tokenService);

    input = {
      email: 'test@teste.com.br',
      password: 'password123',
      role: 'master',
    };

    existingUser = {
      email: input.email,
      password: 'hashed_password',
      isHashed: true,
      role: 'master',
      masterId: new Id().value,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with correct credentials', async () => {
    repository.find.mockResolvedValue(existingUser as any);
    authUserService.comparePassword.mockResolvedValue(true);
    tokenService.generateToken.mockResolvedValue('mocked_token');

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(authUserService.comparePassword).toHaveBeenCalledWith(
      input.password,
      existingUser.password
    );
    expect(tokenService.generateToken).toHaveBeenCalledWith(
      expect.any(AuthUser)
    );
    expect(result).toEqual({ token: 'mocked_token' });
  });

  it('should throw error when user is not found', async () => {
    repository.find.mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(
      'Invalid credentials. Please check your email and password and try again'
    );
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(authUserService.comparePassword).not.toHaveBeenCalled();
    expect(tokenService.generateToken).not.toHaveBeenCalled();
  });

  it('should throw error when password is invalid', async () => {
    repository.find.mockResolvedValue(existingUser as any);
    authUserService.comparePassword.mockResolvedValue(false);

    await expect(usecase.execute(input)).rejects.toThrow(
      'Invalid credentials. Please check your email and password and try again'
    );
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(authUserService.comparePassword).toHaveBeenCalledWith(
      input.password,
      existingUser.password
    );
    expect(tokenService.generateToken).not.toHaveBeenCalled();
  });
});
