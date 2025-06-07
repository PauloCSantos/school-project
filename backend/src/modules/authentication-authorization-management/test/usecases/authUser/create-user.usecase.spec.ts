import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import { CreateAuthUserInputDto } from '@/modules/authentication-authorization-management/application/dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import { ICreateAuthUserOutput } from '@/modules/authentication-authorization-management/application/dto/base-user.dto';

const MockRepository = (): jest.Mocked<AuthUserGateway> => {
  return {
    find: jest.fn(),
    create: jest.fn(authUser =>
      Promise.resolve({ email: authUser.email, masterId: authUser.masterId })
    ),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<AuthUserGateway>;
};

class MockAuthUserService extends AuthUserService {
  async generateHash(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return `hashed_${plain}` === hashed;
  }
}

describe('CreateAuthUser usecase unit test', () => {
  let input: CreateAuthUserInputDto;
  let repository: jest.Mocked<AuthUserGateway>;
  let authUserService: AuthUserService;
  let usecase: CreateAuthUser;
  let generateHashSpy: jest.SpyInstance;

  beforeEach(() => {
    input = {
      email: 'teste@teste.com.br',
      password: 'XpA2Jjd4',
      masterId: new Id().value,
      role: 'master' as RoleUsers,
    };
    repository = MockRepository();
    authUserService = new MockAuthUserService();
    generateHashSpy = jest.spyOn(authUserService, 'generateHash');
    usecase = new CreateAuthUser(repository, authUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user and return the creation result', async () => {
    repository.find.mockResolvedValueOnce(null);

    const output = await usecase.execute(input);

    expect(output.email).toBe(input.email);
    expect(output.masterId).toBe(input.masterId);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should check if user exists before creating', async () => {
    repository.find.mockResolvedValueOnce(null);

    await usecase.execute(input);

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(repository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if user already exists', async () => {
    repository.find.mockResolvedValueOnce({ email: input.email } as AuthUser);

    await expect(usecase.execute(input)).rejects.toThrow(
      'AuthUser already exists'
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should ensure password is hashed before creating user', async () => {
    repository.find.mockResolvedValueOnce(null);

    await usecase.execute(input);

    expect(generateHashSpy).toHaveBeenCalledWith(input.password);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        isHashed: true,
      })
    );
  });

  it('should skip password hashing if already hashed', async () => {
    const hashedInput = {
      ...input,
      isHashed: true,
    };
    repository.find.mockResolvedValueOnce(null);

    await usecase.execute(hashedInput);

    expect(generateHashSpy).not.toHaveBeenCalled();
  });

  it('should throw an error if hashing fails', async () => {
    repository.find.mockResolvedValueOnce(null);
    generateHashSpy.mockRejectedValueOnce(new Error('Hash error'));

    await expect(usecase.execute(input)).rejects.toThrow('Hash error');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should pass the correct entity to repository.create', async () => {
    repository.find.mockResolvedValueOnce(null);

    await usecase.execute(input);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: input.email,
        role: input.role,
        masterId: input.masterId,
      })
    );
  });

  it('should return the result from repository.create', async () => {
    const expectedResult: ICreateAuthUserOutput = {
      email: input.email,
      masterId: input.masterId!,
    };
    repository.find.mockResolvedValueOnce(null);
    repository.create.mockResolvedValueOnce(expectedResult);

    const result = await usecase.execute(input);

    expect(result).toEqual(expectedResult);
  });
});
