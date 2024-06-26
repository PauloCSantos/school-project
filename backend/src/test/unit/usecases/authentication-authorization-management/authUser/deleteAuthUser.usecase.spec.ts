import DeleteAuthUser from '@/application/usecases/authentication-authorization-management/authUser/deleteAuthUser.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/authUser.entity';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/authUser-entity.service';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteAuthUser usecase unit test', () => {
  const input = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().id,
    role: 'master' as RoleUsers,
    isHashed: false,
  };

  const authUserService = new AuthUserService();

  const authUser = new AuthUser(input, authUserService);

  describe('On fail', () => {
    it('should return an error if the authUser does not exist', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteAuthUser(authUserRepository);

      await expect(
        usecase.execute({ email: 'notfound@email.com' })
      ).rejects.toThrow('AuthUser not found');
    });
  });
  describe('On success', () => {
    it('should delete a authUser', async () => {
      const authUserRepository = MockRepository();
      authUserRepository.find.mockResolvedValue(authUser);
      const usecase = new DeleteAuthUser(authUserRepository);
      const result = await usecase.execute({
        email: authUser.email,
      });

      expect(authUserRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
