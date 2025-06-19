import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import { RoleUsers } from '@/modules/@shared/type/enum';

const MockRepository = (): jest.Mocked<AuthUserGateway> => {
  return {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn((authUser, _) => Promise.resolve(authUser)),
    delete: jest.fn(),
  } as jest.Mocked<AuthUserGateway>;
};

class MockAuthUserService extends AuthUserService {
  async generateHash(): Promise<string> {
    return 'hashed_password';
  }

  async comparePassword(): Promise<boolean> {
    return true;
  }
}

describe('UpdateAuthUser usecase unit test', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let authUserService: MockAuthUserService;
  let usecase: UpdateAuthUser;
  let input: {
    email: string;
    password: string;
    masterId: string;
    role: RoleUsers;
    isHashed: boolean;
  };
  let dataToUpdate: {
    password: string;
    email: string;
  };
  let authUser: AuthUser;
  let generateHashSpy: jest.SpyInstance;

  beforeEach(async () => {
    input = {
      email: 'teste@teste.com.br',
      password: 'XpA2Jjd4',
      masterId: new Id().value,
      role: 'master',
      isHashed: false,
    };

    dataToUpdate = {
      password: 'XdQd2Jjd4',
      email: 'newemail@teste.com.br',
    };

    authUserService = new MockAuthUserService();
    authUser = new AuthUser(input, authUserService);
    await authUser.hashPassword();

    repository = MockRepository();
    generateHashSpy = jest.spyOn(authUserService, 'generateHash');

    usecase = new UpdateAuthUser(repository, authUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the authUser does not exist', async () => {
    repository.find.mockResolvedValue(null);

    await expect(
      usecase.execute({
        authUserDataToUpdate: { ...dataToUpdate },
        email: 'emailnotfound@test.com',
      })
    ).rejects.toThrow('AuthUser not found');

    expect(repository.find).toHaveBeenCalledWith('emailnotfound@test.com');
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should update an authUser successfully', async () => {
    repository.find.mockResolvedValue(authUser);

    const result = await usecase.execute({
      authUserDataToUpdate: { ...dataToUpdate },
      email: input.email,
    });

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(repository.update).toHaveBeenCalled();
    expect(generateHashSpy).toHaveBeenCalled();
    expect(result).toStrictEqual({
      email: dataToUpdate.email,
      role: input.role,
    });
  });

  it('should only update the provided fields', async () => {
    repository.find.mockResolvedValue(authUser);
    const partialUpdate = { email: 'newemail@teste.com.br' };

    await usecase.execute({
      authUserDataToUpdate: partialUpdate,
      email: input.email,
    });

    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        _email: partialUpdate.email,
        _masterId: input.masterId,
        _role: input.role,
      }),
      input.email
    );
  });
});
