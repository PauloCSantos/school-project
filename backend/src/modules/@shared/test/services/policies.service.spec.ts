import { PoliciesService } from '../../application/services/policies.service';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '../../enums/enums';
import { TokenData } from '../../type/sharedTypes';

describe('PoliciesService', () => {
  let svc: PoliciesService;

  beforeEach(() => {
    svc = new PoliciesService();
  });

  describe('verifyPolicies', () => {
    it('should allow authuser.create for MASTER without token', async () => {
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.AUTHUSER,
          FunctionCalledEnum.CREATE,
          undefined,
          { targetRole: RoleUsersEnum.MASTER }
        )
      ).resolves.toBeUndefined();
    });

    it('should throw generic Error for authuser.create without token but non-MASTER target', async () => {
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.AUTHUSER,
          FunctionCalledEnum.CREATE,
          undefined,
          { targetRole: RoleUsersEnum.ADMINISTRATOR }
        )
      ).rejects.toThrow();
    });

    it('should throw generic Error for any other operation without token', async () => {
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.EVENT,
          FunctionCalledEnum.DELETE,
          undefined
        )
      ).rejects.toThrow();
    });

    it('should throw AccessDeniedException when module not accessible for role', async () => {
      const token: TokenData = {
        email: 'user@example.com',
        role: RoleUsersEnum.ADMINISTRATOR,
        masterId: 'master-id',
      };
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.TENANT,
          FunctionCalledEnum.DELETE,
          token
        )
      ).rejects.toThrow();
    });

    it('should throw AccessDeniedException for explicitly denied action', async () => {
      const token: TokenData = {
        email: 'user@example.com',
        role: RoleUsersEnum.TEACHER,
        masterId: 'master-id',
      };
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.AUTHUSER,
          FunctionCalledEnum.DELETE,
          token
        )
      ).rejects.toThrow();
    });

    it('should throw AccessDeniedException when SELF permission but wrong targetEmail', async () => {
      const token: TokenData = {
        email: 'a@b.com',
        role: RoleUsersEnum.TEACHER,
        masterId: 'master-id',
      };
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.AUTHUSER,
          FunctionCalledEnum.FIND,
          token,
          { targetEmail: 'x@y.com' }
        )
      ).rejects.toThrow();
    });

    it('should allow SELF permission when targetEmail matches token email', async () => {
      const token: TokenData = {
        email: 'a@b.com',
        role: RoleUsersEnum.ADMINISTRATOR,
        masterId: 'master-id',
      };
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.AUTHUSER,
          FunctionCalledEnum.FIND,
          token,
          { targetEmail: 'a@b.com' }
        )
      ).resolves.toBeUndefined();
    });

    it('should throw AccessDeniedException for EXCEPT_MASTER when targetRole is MASTER', async () => {
      const token: TokenData = {
        email: 'user@example.com',
        role: RoleUsersEnum.ADMINISTRATOR,
        masterId: 'master-id',
      };
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.AUTHUSER,
          FunctionCalledEnum.UPDATE,
          token,
          { targetRole: RoleUsersEnum.MASTER }
        )
      ).rejects.toThrow();
    });

    it('should allow EXCEPT_MASTER for non-MASTER targetRole', async () => {
      const token: TokenData = {
        email: 'user@example.com',
        role: RoleUsersEnum.ADMINISTRATOR,
        masterId: 'master-id',
      };
      await expect(
        svc.verifyPolicies(
          ModulesNameEnum.AUTHUSER,
          FunctionCalledEnum.UPDATE,
          token,
          { targetRole: RoleUsersEnum.ADMINISTRATOR }
        )
      ).resolves.toBeUndefined();
    });
  });
});
