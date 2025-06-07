import Id from '@/modules/@shared/domain/value-object/id.value-object';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import TokenService from '@/modules/@shared/infraestructure/service/token.service';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { RoleUsers } from '@/modules/@shared/type/enum';

const MockRepository = (): jest.Mocked<AuthUserGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<AuthUserGateway>;
};

class MockAuthUserService extends AuthUserService {
  async comparePassword(): Promise<boolean> {
    return true;
  }

  async generateHash(password: string): Promise<string> {
    return `hashed_${password}`;
  }
}

class MockTokenService extends TokenService {
  constructor() {
    super('secret');
  }

  async generateToken(): Promise<string> {
    return 'mocked_token';
  }
}

describe('LoginAuthUser usecase unit test', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let authUserService: MockAuthUserService;
  let tokenService: MockTokenService;
  let usecase: LoginAuthUser;
  let loginInput: {
    email: string;
    password: string;
    role: RoleUsers;
  };
  let userData: {
    email: string;
    password: string;
    masterId: string;
    role: RoleUsers;
    isHashed: boolean;
  };
  let authUser: AuthUser;
  let comparePasswordSpy: jest.SpyInstance;
  let generateTokenSpy: jest.SpyInstance;

  beforeEach(async () => {
    loginInput = {
      email: 'teste@teste.com.br',
      password: 'ioNO9V',
      role: 'master' as RoleUsers,
    };

    userData = {
      email: 'teste@teste.com.br',
      password: 'hashed_password',
      masterId: new Id().value,
      role: 'master' as RoleUsers,
      isHashed: true,
    };

    repository = MockRepository();
    authUserService = new MockAuthUserService();
    tokenService = new MockTokenService();
    authUser = new AuthUser(userData, authUserService);

    comparePasswordSpy = jest.spyOn(authUserService, 'comparePassword');
    generateTokenSpy = jest.spyOn(tokenService, 'generateToken');

    usecase = new LoginAuthUser(repository, authUserService, tokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with correct credentials', async () => {
    repository.find.mockResolvedValue(authUser);
    comparePasswordSpy.mockResolvedValue(true);
    generateTokenSpy.mockResolvedValue('mocked_token');

    const result = await usecase.execute(loginInput);

    expect(repository.find).toHaveBeenCalledWith(loginInput.email);
    expect(comparePasswordSpy).toHaveBeenCalled();
    expect(generateTokenSpy).toHaveBeenCalled();
    expect(result).toEqual({ token: 'mocked_token' });
  });

  it('should throw error when user is not found', async () => {
    repository.find.mockResolvedValue(null);

    await expect(
      usecase.execute({
        email: 'nonexistent@teste.com.br',
        password: 'any_password',
        role: 'master' as RoleUsers,
      })
    ).rejects.toThrow(
      'Invalid credentials. Please check your email and password and try again'
    );

    expect(repository.find).toHaveBeenCalledWith('nonexistent@teste.com.br');
    expect(comparePasswordSpy).not.toHaveBeenCalled();
    expect(generateTokenSpy).not.toHaveBeenCalled();
  });

  it('should throw error when password is invalid', async () => {
    repository.find.mockResolvedValue(authUser);
    comparePasswordSpy.mockResolvedValue(false);

    await expect(
      usecase.execute({
        email: 'teste@teste.com.br',
        password: 'wrong_password',
        role: 'master' as RoleUsers,
      })
    ).rejects.toThrow(
      'Invalid credentials. Please check your email and password and try again'
    );

    expect(repository.find).toHaveBeenCalledWith(loginInput.email);
    expect(comparePasswordSpy).toHaveBeenCalled();
    expect(generateTokenSpy).not.toHaveBeenCalled();
  });
});
