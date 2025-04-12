import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/service/token.service';

describe('TokenService unit test', () => {
  describe('On fail', () => {
    it('Should create an expired token with the AuthUser instance', async () => {
      const authUserService = new AuthUserService();
      const authUser = new AuthUser(
        {
          email: 'teste@teste.com.br',
          password: 'XpA2Jjd4',
          role: 'master' as RoleUsers,
        },
        authUserService
      );
      const secretKey = 'PxHf3H7';
      const tokenService = new TokenService(secretKey);
      const token = await tokenService.generateToken(authUser, -1);
      const tokenData = await tokenService.validateToken(token);
      expect(tokenData).toBe(null);
    });
    it('Should not validate a token', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCK6Ijk1MzIwYWU4LWNjMDItNDEwMy1iZjZkLThlYjEwYjc3NWJhMSIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcwOTkyNDIyNiwiZXhwIjoxNzA5OTI2MDI2fQ.QCuJ6riJEe6m-7r-qkeZKI9JxvyVQJfNASHuc1GrVgg';
      const secretKey = 'PxHf3H7';
      const tokenService = new TokenService(secretKey);
      const tokenData = await tokenService.validateToken(token);
      expect(tokenData).toBe(null);
    });
  });
  describe('On success', () => {
    it('Should create a token with the AuthUser instance, role master', async () => {
      const authUserService = new AuthUserService();
      const authUser = new AuthUser(
        {
          email: 'teste@teste.com.br',
          password: 'XpA2Jjd4',
          role: 'master' as RoleUsers,
        },
        authUserService
      );
      const secretKey = 'PxHf3H7';
      const tokenService = new TokenService(secretKey);
      const token = await tokenService.generateToken(authUser, '500d');
      expect(token).toBeDefined();
    });
    it('Should create a token with the AuthUser instance, role teacher', async () => {
      const authUserService = new AuthUserService();
      const authUser = new AuthUser(
        {
          email: 'teste@teste.com.br',
          password: 'XpA2Jjd4',
          role: 'teacher' as RoleUsers,
          masterId: new Id().value,
        },
        authUserService
      );
      const secretKey = 'PxHf3H7';
      const tokenService = new TokenService(secretKey);
      const token = await tokenService.generateToken(authUser, '500d');
      expect(token).toBeDefined();
    });
    it('Should validate a token', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6Ijk1MzIwYWU4LWNjMDItNDEwMy1iZjZkLThlYjEwYjc3NWJhMSIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcwOTkyNDIyNiwiZXhwIjoxNzA5OTI2MDI2fQ.QCuJ6riJEe6m-7r-qkeZKI9JxvyVQJfNASHuc1GrVgg';
      const secretKey = 'PxHf3H7';
      const tokenService = new TokenService(secretKey);
      const tokenData = await tokenService.validateToken(token);
      expect(tokenData).toBeDefined();
    });
  });
});
