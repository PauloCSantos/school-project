import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/createAuthUser.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/authUser.entity';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/authUser-entity.service';

const MockRepository = () => {
  return {
    find: jest.fn(),
    create: jest.fn(authUser => Promise.resolve(authUser.email)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createAuthUser usecase unit test', () => {
  const input = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().value,
    role: 'master' as RoleUsers,
    isHashed: false,
  };
  const authUserService = new AuthUserService();

  const authUser = new AuthUser(input, authUserService);

  describe('On fail', () => {
    it('should throw an error if the authUser already exists', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(authUser);

      const usecase = new CreateAuthUser(authUserRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'AuthUser already exists'
      );
      expect(authUserRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(authUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a authUser', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateAuthUser(authUserRepository);
      const result = await usecase.execute(input);

      expect(authUserRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(authUserRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
