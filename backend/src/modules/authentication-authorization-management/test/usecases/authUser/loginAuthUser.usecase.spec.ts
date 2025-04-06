import Id from '@/modules/@shared/domain/value-object/id.value-object';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/loginAuthUser.usecase';
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

describe('loginAuthUser usecase unit test', () => {
  const authUserService = new AuthUserService();

  const authUser = new AuthUser(
    {
      email: 'teste@teste.com.br',
      password: 'ioNO9V',
      masterId: new Id().id,
      role: 'master' as RoleUsers,
      isHashed: false,
    },
    authUserService
  );

  describe('On success', () => {
    it('Should login with correct credentials', async () => {
      const authUserRepository = MockRepository();
      await authUser.hashPassword();
      authUserRepository.find.mockResolvedValue(authUser);
      const usecase = new LoginAuthUser(authUserRepository);
      const result = await usecase.execute({
        email: 'teste@teste.com.br',
        password: 'ioNO9V',
        role: 'master' as RoleUsers,
      });
      expect(authUserRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
