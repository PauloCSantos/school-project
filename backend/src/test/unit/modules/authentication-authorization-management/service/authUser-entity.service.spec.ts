import AuthUserService from '@/modules/authentication-authorization-management/domain/service/authUser-entity.service';

describe('AuthUserService unit test', () => {
  describe('On success', () => {
    it('Should create a hash with password', async () => {
      const password = 'PxHf3H7';
      const authUserService = new AuthUserService();
      const hashPassword = await authUserService.generateHash(password);
      expect(authUserService).toBeInstanceOf(AuthUserService);
      expect(hashPassword).toBeDefined;
      expect(hashPassword.length).toBeGreaterThan(0);
    });
    it('Should validate a hash', async () => {
      const password = 'PxHf3H7';
      const wrongPassword = 'Qx3h4dS';
      const authUserService = new AuthUserService();
      const hashPassword = await authUserService.generateHash(password);

      expect(authUserService).toBeInstanceOf(AuthUserService);
      expect(
        async () =>
          await authUserService.comparePassword(password, hashPassword)
      ).toBeTruthy;
      expect(
        async () =>
          await authUserService.comparePassword(password, wrongPassword)
      ).toBeFalsy;
    });
  });
});
