import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';

const MockRepository = (): jest.Mocked<AuthUserGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<AuthUserGateway>;
};

describe('FindAuthUser usecase unit test', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let usecase: FindAuthUser;
  let authUserService: AuthUserService;
  let input: {
    email: string;
    password: string;
    masterId: string;
    role: RoleUsers;
    isHashed: boolean;
  };
  let authUser: AuthUser;

  beforeEach(async () => {
    input = {
      email: 'teste@teste.com.br',
      password: 'XpA2Jjd4',
      masterId: new Id().value,
      role: 'master' as RoleUsers,
      isHashed: true,
    };

    authUserService = new AuthUserService();
    authUser = new AuthUser(input, authUserService);
    repository = MockRepository();
    usecase = new FindAuthUser(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find an authUser when it exists', async () => {
    const mockReturnedUser = {
      email: input.email,
      masterId: input.masterId,
      role: input.role,
      isHashed: input.isHashed,
    };

    repository.find.mockResolvedValue(mockReturnedUser as unknown as AuthUser);

    const result = await usecase.execute({ email: input.email });

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toEqual(mockReturnedUser);
  });

  it('should return null when email is not found', async () => {
    repository.find.mockResolvedValue(null);
    const notFoundEmail = 'notfound@teste.com.br';

    const result = await usecase.execute({ email: notFoundEmail });

    expect(repository.find).toHaveBeenCalledWith(notFoundEmail);
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});
