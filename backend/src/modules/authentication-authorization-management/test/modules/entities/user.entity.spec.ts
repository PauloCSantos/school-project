import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';

describe('AuthUser unit test', () => {
  const authUserService = new AuthUserService();

  const baseUserData = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    masterId: new Id().value,
    role: 'master' as RoleUsers,
    isHashed: false,
  };

  let authUser: AuthUser;

  beforeEach(() => {
    authUser = new AuthUser({ ...baseUserData }, authUserService);
  });

  describe('Failure cases', () => {
    it('should throw an error when input is missing required fields', () => {
      //@ts-expect-error
      expect(() => new AuthUser({})).toThrow('All fields are mandatory');
    });

    it('should throw an error when email is invalid during creation', () => {
      expect(() => {
        new AuthUser({ ...baseUserData, email: 'invalid' }, authUserService);
      }).toThrow('Field email is not valid');
    });

    it('should throw an error when setting an invalid email after creation', () => {
      expect(() => {
        authUser.email = 'invalid.com';
      }).toThrow('Field email is not valid');
    });

    it('should throw an error when trying to compare password before hashing', async () => {
      const password = baseUserData.password;
      await expect(authUser.comparePassword(password)).rejects.toThrow(
        'Use the method to hash before comparing'
      );
    });
  });

  describe('Success cases', () => {
    it('should create a valid AuthUser instance', () => {
      expect(authUser).toBeInstanceOf(AuthUser);
      expect(authUser.email).toBe(baseUserData.email);
      expect(authUser.masterId).toBe(baseUserData.masterId);
      expect(authUser.role).toBe(baseUserData.role);
    });

    it('should allow updating user email with a valid value', () => {
      authUser.email = 'teste2@teste.com.br';
      expect(authUser.email).toBe('teste2@teste.com.br');
    });

    it('should hash the password correctly', async () => {
      await authUser.hashPassword();
      expect(authUser.password).not.toBe(baseUserData.password);
      expect(authUser.password.length).toBeGreaterThan(20);
    });

    it('should not rehash the password if already hashed', async () => {
      await authUser.hashPassword();
      const hashedOnce = authUser.password;
      await authUser.hashPassword();
      expect(authUser.password).toBe(hashedOnce);
    });

    it('should correctly compare the hashed password', async () => {
      const plainPassword = baseUserData.password;
      await authUser.hashPassword();
      const result = await authUser.comparePassword(plainPassword);
      expect(result).toBe(true);
    });

    it('should return false when comparing with incorrect password', async () => {
      await authUser.hashPassword();
      const result = await authUser.comparePassword('wrongPassword');
      expect(result).toBe(false);
    });

    it('should respect isHashed flag and not rehash an already hashed password', async () => {
      const hashedPassword = await authUserService.generateHash(
        baseUserData.password
      );
      const preHashedUser = new AuthUser(
        { ...baseUserData, password: hashedPassword, isHashed: true },
        authUserService
      );
      await preHashedUser.hashPassword();
      expect(preHashedUser.password).toBe(hashedPassword);
    });
  });
});
