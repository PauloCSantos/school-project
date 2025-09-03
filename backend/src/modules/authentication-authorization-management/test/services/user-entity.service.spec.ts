import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';

describe('AuthUserService unit test', () => {
  describe('On success', () => {
    it('Should create a hash with password', async () => {
      const password = 'secretkey';
      const authUserService = new AuthUserService();
      const hashPassword = await authUserService.generateHash(password);

      expect(authUserService).toBeInstanceOf(AuthUserService);
      expect(hashPassword).toBeDefined();
      expect(hashPassword.length).toBeGreaterThan(0);
      expect(hashPassword).not.toEqual(password);
    });

    it('Should validate a hash', async () => {
      const password = 'secretkey';
      const wrongPassword = 'Qx3h4dS';
      const authUserService = new AuthUserService();
      const hashPassword = await authUserService.generateHash(password);

      expect(await authUserService.comparePassword(password, hashPassword)).toBe(true);
      expect(await authUserService.comparePassword(wrongPassword, hashPassword)).toBe(
        false
      );
    });

    it('Should generate different hashes for the same password, but both should validate', async () => {
      const password = 'secretkey';
      const authUserService = new AuthUserService();
      const hash1 = await authUserService.generateHash(password);
      const hash2 = await authUserService.generateHash(password);

      expect(hash1).not.toEqual(hash2);
      expect(await authUserService.comparePassword(password, hash1)).toBe(true);
      expect(await authUserService.comparePassword(password, hash2)).toBe(true);
    });
  });
});
