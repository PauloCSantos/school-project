import Id from '@/modules/@shared/domain/value-object/id.value-object';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';

const MockRepository = (): jest.Mocked<AuthUserGateway> => {
  return {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(_ => Promise.resolve('Operação concluída com sucesso')),
  } as jest.Mocked<AuthUserGateway>;
};

describe('DeleteAuthUser usecase unit test', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let usecase: DeleteAuthUser;
  let authUserService: AuthUserService;
  let input: {
    email: string;
    password: string;
    masterId: string;
    role: RoleUsers;
    isHashed: boolean;
  };
  let authUser: AuthUser;

  beforeEach(() => {
    input = {
      email: 'teste@teste.com.br',
      password: 'XpA2Jjd4',
      masterId: new Id().value,
      role: 'master' as RoleUsers,
      isHashed: false,
    };

    authUserService = new AuthUserService();
    authUser = new AuthUser(input, authUserService);
    repository = MockRepository();
    usecase = new DeleteAuthUser(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the authUser does not exist', async () => {
    repository.find.mockResolvedValue(null);

    await expect(
      usecase.execute({ email: 'notfound@email.com' })
    ).rejects.toThrow('AuthUser not found');

    expect(repository.find).toHaveBeenCalledWith('notfound@email.com');
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('should delete an authUser successfully', async () => {
    repository.find.mockResolvedValue(authUser);

    const result = await usecase.execute({ email: input.email });

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(repository.delete).toHaveBeenCalledWith(input.email);
    expect(result).toBeDefined();
    expect(result.message).toBe('Operação concluída com sucesso');
  });
});
