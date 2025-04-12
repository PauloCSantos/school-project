import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';

describe('AuthUser unit test', () => {
  const authUserData = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().value,
    role: 'master' as RoleUsers,
    isHashed: false,
  };
  const authUserService = new AuthUserService();

  describe('On fail', () => {
    it('should throw error when the input have missing values', () => {
      //@ts-expect-error
      expect(() => new AuthUser({})).toThrow('All fields are mandatory');
    });
    it('should throw error when setting an invalid email', () => {
      const authUser = new AuthUser(authUserData, authUserService);

      expect(() => {
        authUser.email = 'teste.com.br';
      }).toThrow('Field email is not valid');
    });
    it('should throw an error when using compare before hashing the password', () => {
      const authUser = new AuthUser(authUserData, authUserService);
      const password = authUserData.password;
      expect(() => authUser.comparePassword(password)).rejects.toThrow(
        'Use the method to hash before comparing'
      );
    });
  });

  describe('On success', () => {
    it('Should create a authUser with valid input', () => {
      const authUser = new AuthUser(authUserData, authUserService);
      expect(authUser).toBeInstanceOf(AuthUser);
      expect(authUser.email).toBe(authUserData.email);
      expect(authUser.masterId).toBe(authUserData.masterId);
      expect(authUser.role).toBe(authUserData.role);
    });
    it('Should update values', () => {
      const authUserInstance = new AuthUser(authUserData, authUserService);
      authUserInstance.email = 'teste2@teste.com.br';

      expect(authUserInstance.email).toBe('teste2@teste.com.br');
    });
    it('Should compare the password with the hash', async () => {
      const authUser = new AuthUser(authUserData, authUserService);
      const password = authUserData.password;
      await authUser.hashPassword();
      expect(async () => await authUser.comparePassword(password)).toBeTruthy;
    });
    it('Should hash the password only once', async () => {
      const authUser = new AuthUser(authUserData, authUserService);
      const password = authUserData.password;
      await authUser.hashPassword();
      await authUser.hashPassword();
      expect(async () => await authUser.comparePassword(password)).toBeTruthy;
    });
  });
});
