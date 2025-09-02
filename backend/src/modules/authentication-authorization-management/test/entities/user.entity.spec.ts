import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';

describe('AuthUser unit test', () => {
  const authUserService = new AuthUserService();

  const baseUserData = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
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
        'Internal server error'
      );
    });

    it('should throw an error when password is invalid during creation', () => {
      expect(() => {
        new AuthUser({ ...baseUserData, password: '' }, authUserService);
      }).toThrow('Field password is not valid');
    });

    it('should throw an error when setting an invalid password after creation', () => {
      expect(() => {
        authUser.password = '';
      }).toThrow('Field password is not valid');
    });

    it('should throw an error when isHashed flag is not a boolean', () => {
      expect(() => {
        //@ts-expect-error
        new AuthUser({ ...baseUserData, isHashed: 'true' });
      }).toThrow('The field isHashed must be a boolean');
    });
  });

  describe('Success cases', () => {
    it('should create a valid AuthUser instance', () => {
      expect(authUser).toBeInstanceOf(AuthUser);
      expect(authUser.email).toBe(baseUserData.email);
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
      const hashedPassword = await authUserService.generateHash(baseUserData.password);
      const preHashedUser = new AuthUser(
        { ...baseUserData, password: hashedPassword, isHashed: true },
        authUserService
      );
      await preHashedUser.hashPassword();
      expect(preHashedUser.password).toBe(hashedPassword);
    });

    it('should have isHashed false by default', () => {
      expect(authUser.isHashed).toBe(false);
    });

    it('should set isHashed to true after hashing password', async () => {
      await authUser.hashPassword();
      expect(authUser.isHashed).toBe(true);
    });

    it('should allow setting a new password and reset isHashed flag', async () => {
      await authUser.hashPassword();
      expect(authUser.isHashed).toBe(true);

      authUser.password = 'MyN3wP@ss';
      expect(authUser.isHashed).toBe(false);

      await authUser.hashPassword();
      expect(authUser.isHashed).toBe(true);
      const match = await authUser.comparePassword('MyN3wP@ss');
      expect(match).toBe(true);
    });

    it('should report active status true by default', async () => {
      const status = authUser.isActive;
      expect(status).toBe(true);
    });

    it('should deactivate and activate the user correctly', async () => {
      authUser.deactivate();
      expect(authUser.isActive).toBe(false);

      authUser.reactivate();
      expect(await authUser.isActive).toBe(true);
    });
  });
});
