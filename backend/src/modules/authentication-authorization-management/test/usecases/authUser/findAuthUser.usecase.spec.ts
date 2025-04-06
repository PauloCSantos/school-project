import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/findAuthUser.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/authUser.entity';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/authUser-entity.service';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAuthUser usecase unit test', () => {
  const input = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().id,
    role: 'master' as RoleUsers,
    isHashed: false,
  };
  const authUserService = new AuthUserService();

  const authUser = new AuthUser(input, authUserService);

  describe('On success', () => {
    it('should find a authUser', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(authUser);
      const usecase = new FindAuthUser(authUserRepository);

      const result = await usecase.execute({ email: authUser.email });

      expect(authUserRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when email is not found', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(undefined);

      const usecase = new FindAuthUser(authUserRepository);
      const result = await usecase.execute({
        email: 'notfound@teste.com.br',
      });

      expect(result).toBe(undefined);
    });
  });
});
