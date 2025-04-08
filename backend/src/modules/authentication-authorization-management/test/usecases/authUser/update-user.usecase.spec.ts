import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/user-entity.service';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(authUser => Promise.resolve(authUser)),
    delete: jest.fn(),
  };
};

describe('updateAuthUser usecase unit test', () => {
  const input = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().value,
    role: 'master' as RoleUsers,
    isHashed: false,
  };
  const dataToUpdate = {
    password: 'XdQd2Jjd4',
    email: 'newemail@teste.com.br',
  };
  const authUserService = new AuthUserService();

  const authUser = new AuthUser(input, authUserService);

  describe('On fail', () => {
    it('should throw an error if the authUser does not exist', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateAuthUser(authUserRepository);

      await expect(
        usecase.execute({
          authUserDataToUpdate: { ...dataToUpdate },
          email: 'emailnotfound@test.com',
        })
      ).rejects.toThrow('AuthUser not found');
    });
  });
  describe('On success', () => {
    it('should update an authUser', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(authUser);
      const usecase = new UpdateAuthUser(authUserRepository);

      const result = await usecase.execute({
        authUserDataToUpdate: { ...dataToUpdate },
        email: input.email,
      });

      expect(authUserRepository.update).toHaveBeenCalled();
      expect(authUserRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        email: dataToUpdate.email,
        role: input.role,
      });
    });
  });
});
