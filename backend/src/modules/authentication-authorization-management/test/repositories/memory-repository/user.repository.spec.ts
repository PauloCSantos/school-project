import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/user.repository';

describe('MemoryAuthUserRepository unit test', () => {
  let repository: MemoryAuthUserRepository;
  const authUserService = new AuthUserService();
  const authUser1 = new AuthUser(
    {
      email: 'teste@teste.com.br',
      password: '123456',
      role: 'master',
    },
    authUserService
  );
  const authUser2 = new AuthUser(
    {
      email: 'teste2@teste.com.br',
      password: '123456',
      role: 'administrator',
      masterId: new Id().value,
    },
    authUserService
  );
  const authUser3 = new AuthUser(
    {
      email: 'teste3@teste.com.br',
      password: '123456',
      role: 'master',
    },
    authUserService
  );

  beforeEach(() => {
    repository = new MemoryAuthUserRepository([authUser1, authUser2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const authUserEmail = 'teste5@teste.com.br';
      const authUserFound = await repository.find(authUserEmail);

      expect(authUserFound).toBeUndefined();
    });
    it('should throw an error when the email is wrong', async () => {
      const authUser = new AuthUser(
        {
          email: 'teste7@teste.com.br',
          password: '12345678',
          role: 'master',
        },
        authUserService
      );

      await expect(
        repository.update(authUser, 'notfound@teste.com')
      ).rejects.toThrow('AuthUser not found');
    });
    it('should generate an error when trying to remove the authUser with the wrong email', async () => {
      await expect(repository.delete('notfound@teste.com')).rejects.toThrow(
        'AuthUser not found'
      );
    });
  });

  describe('On success', () => {
    it('should find a authUser', async () => {
      const authUserEmail = authUser1.email;
      const authUserFound = await repository.find(authUserEmail);

      expect(authUserFound).toBeDefined();
      expect(authUserFound!.email).toBe(authUser1.email);
      expect(authUserFound!.masterId).toBe(authUser1.masterId);
      expect(authUserFound!.role).toBe(authUser1.role);
    });
    it('should create a new authUser and return its id', async () => {
      const result = await repository.create(authUser3);

      expect(result.email).toBe(authUser3.email);
      expect(result.masterId).toBe(authUser3.masterId);
    });
    it('should update a authUser and return its new informations', async () => {
      const updateAuthUser: AuthUser = authUser2;
      updateAuthUser.role = 'teacher';
      const result = await repository.update(
        updateAuthUser,
        'teste2@teste.com.br'
      );
      expect(result).toBeDefined();
    });
    it('should remove the authUser', async () => {
      const response = await repository.delete(authUser1.email);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
