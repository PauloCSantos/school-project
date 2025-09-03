import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('TokenService unit test', () => {
  const secretKey = 'secretkey';
  const tokenService = new TokenService(secretKey);

  const authUserService = new AuthUserService();
  const masterUser = new AuthUser(
    {
      email: 'teste@teste.com.br',
      password: 'XpA2Jjd4',
    },
    authUserService
  );
  const teacherUser = new AuthUser(
    {
      email: 'teacher@teste.com.br',
      password: 'XpA2Jjd4',
    },
    authUserService
  );
  const masterId = new Id().value;

  describe('On fail', () => {
    it('should return null for an expired token', async () => {
      const token = await tokenService.generateToken(
        masterUser,
        masterId,
        RoleUsersEnum.TEACHER,
        -1
      );
      const result = await tokenService.validateToken(token);
      expect(result).toBeNull();
    });

    it('should return null for a malformed token', async () => {
      const fakeToken = 'invalid.token.here';
      const result = await tokenService.validateToken(fakeToken);
      expect(result).toBeNull();
    });
  });

  describe('On success', () => {
    it('should generate and validate a valid token for master user', async () => {
      const token = await tokenService.generateToken(
        masterUser,
        masterId,
        RoleUsersEnum.MASTER
      );
      expect(token).toBeDefined();

      const decoded = await tokenService.validateToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.email).toBe(masterUser.email);
      expect(decoded?.role).toBe(RoleUsersEnum.MASTER);
      expect(decoded?.masterId).toBe(masterId);
    });

    it('should generate and validate a valid token for teacher user', async () => {
      const token = await tokenService.generateToken(
        teacherUser,
        masterId,
        RoleUsersEnum.TEACHER
      );
      expect(token).toBeDefined();

      const decoded = await tokenService.validateToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.email).toBe(teacherUser.email);
      expect(decoded?.role).toBe(RoleUsersEnum.TEACHER);
      expect(decoded?.masterId).toBe(masterId);
    });

    it('should refresh a token and validate the new token', async () => {
      const originalToken = await tokenService.generateToken(
        masterUser,
        masterId,
        RoleUsersEnum.MASTER,
        60
      );
      const refreshedToken = await tokenService.refreshExpiresToken(originalToken);

      expect(refreshedToken).toBeDefined();
      expect(refreshedToken).not.toBe(originalToken);

      const decoded = await tokenService.validateToken(refreshedToken);
      expect(decoded).not.toBeNull();
      expect(decoded?.email).toBe(masterUser.email);
      expect(decoded?.role).toBe(RoleUsersEnum.MASTER);
      expect(decoded?.masterId).toBe(masterId);
    });
  });
});
