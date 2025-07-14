import {
  PoliciesService,
  PoliciesServiceInterface,
} from '../../application/services/policies.service';
import {
  FunctionCalledEnum,
  RoleUsersEnum,
  TokenData,
} from '../../type/sharedTypes';

describe('PoliciesService', () => {
  let svc: PoliciesServiceInterface;

  beforeEach(() => {
    svc = new PoliciesService();
  });

  describe('MASTER role', () => {
    const token: TokenData = {
      email: 'any@mail.com',
      role: RoleUsersEnum.MASTER,
      masterId: 'master123',
    };

    it('should allow any action and module', async () => {
      expect(
        await svc.verifyPolicies('student', FunctionCalledEnum.CREATE, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.DELETE, token, {
          targetEmail: 'x',
          targetRole: RoleUsersEnum.STUDENT,
        })
      ).toBe(true);
    });
  });

  describe('ADMINISTRATOR role', () => {
    const token = {
      email: 'admin@mail.com',
      role: RoleUsersEnum.ADMINISTRATOR,
      masterId: 'master123',
    };

    it('should deny authUser actions targeting master (except-master)', async () => {
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.FIND, token, {
          targetRole: RoleUsersEnum.MASTER,
        })
      ).toBe(false);
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.UPDATE, token, {
          targetRole: RoleUsersEnum.MASTER,
        })
      ).toBe(false);
    });

    it('should allow authUser actions for non-master targets', async () => {
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.CREATE, token, {
          targetRole: RoleUsersEnum.TEACHER,
        })
      ).toBe(true);
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.DELETE, token, {
          targetRole: RoleUsersEnum.STUDENT,
        })
      ).toBe(true);
    });

    it('should allow all CRUD on other modules', async () => {
      expect(
        await svc.verifyPolicies('student', FunctionCalledEnum.CREATE, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('subject', FunctionCalledEnum.FIND, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('event', FunctionCalledEnum.UPDATE, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('attendance', FunctionCalledEnum.DELETE, token)
      ).toBe(true);
    });
  });

  describe('TEACHER role', () => {
    const token = {
      email: 'teacher@mail.com',
      role: RoleUsersEnum.TEACHER,
      masterId: 'master123',
    };

    it('should allow SELF on authUser and teacher modules', async () => {
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.FIND, token, {
          targetEmail: 'teacher@mail.com',
        })
      ).toBe(true);
      expect(
        await svc.verifyPolicies('teacher', FunctionCalledEnum.UPDATE, token, {
          targetEmail: 'teacher@mail.com',
        })
      ).toBe(true);
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.UPDATE, token, {
          targetEmail: 'other@mail.com',
        })
      ).toBe(false);
    });

    it('should allow FINDing student and subject modules', async () => {
      expect(
        await svc.verifyPolicies('student', FunctionCalledEnum.FIND, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('subject', FunctionCalledEnum.FIND, token)
      ).toBe(true);
    });

    it('should allow CRUD on evaluation, note, attendance', async () => {
      expect(
        await svc.verifyPolicies('evaluation', FunctionCalledEnum.CREATE, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('note', FunctionCalledEnum.DELETE, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('attendance', FunctionCalledEnum.UPDATE, token)
      ).toBe(true);
    });

    it('should deny delete on lesson and event', async () => {
      expect(
        await svc.verifyPolicies('lesson', FunctionCalledEnum.DELETE, token)
      ).toBe(false);
      expect(
        await svc.verifyPolicies('event', FunctionCalledEnum.DELETE, token)
      ).toBe(false);
    });
  });

  describe('STUDENT role', () => {
    const token = {
      email: 'student@mail.com',
      role: RoleUsersEnum.STUDENT,
      masterId: 'master123',
    };

    it('should allow SELF on authUser and student modules', async () => {
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.UPDATE, token, {
          targetEmail: 'student@mail.com',
        })
      ).toBe(true);
      expect(
        await svc.verifyPolicies('student', FunctionCalledEnum.FIND, token, {
          targetEmail: 'student@mail.com',
        })
      ).toBe(true);
      expect(
        await svc.verifyPolicies('student', FunctionCalledEnum.UPDATE, token, {
          targetEmail: 'other@mail.com',
        })
      ).toBe(false);
    });

    it('should allow FIND on subject, lesson, event, evaluation, note, attendance', async () => {
      const modules = [
        'subject',
        'lesson',
        'event',
        'evaluation',
        'note',
        'attendance',
      ] as const;
      for (const module of modules) {
        expect(
          await svc.verifyPolicies(module, FunctionCalledEnum.FIND, token)
        ).toBe(true);
      }
    });

    it('should deny create on note (undefined in policies)', async () => {
      expect(
        await svc.verifyPolicies('note', FunctionCalledEnum.CREATE, token)
      ).toBe(false);
    });
  });

  describe('WORKER role', () => {
    const token = {
      email: 'worker@mail.com',
      role: RoleUsersEnum.WORKER,
      masterId: 'master123',
    };

    it('should allow SELF on authUser and worker modules', async () => {
      expect(
        await svc.verifyPolicies('authuser', FunctionCalledEnum.UPDATE, token, {
          targetEmail: 'worker@mail.com',
        })
      ).toBe(true);
      expect(
        await svc.verifyPolicies('worker', FunctionCalledEnum.FIND, token, {
          targetEmail: 'worker@mail.com',
        })
      ).toBe(true);
      expect(
        await svc.verifyPolicies('worker', FunctionCalledEnum.UPDATE, token, {
          targetEmail: 'other@mail.com',
        })
      ).toBe(false);
    });

    it('should allow FIND on event and deny create/update/delete', async () => {
      expect(
        await svc.verifyPolicies('event', FunctionCalledEnum.FIND, token)
      ).toBe(true);
      expect(
        await svc.verifyPolicies('event', FunctionCalledEnum.CREATE, token)
      ).toBe(false);
      expect(
        await svc.verifyPolicies('event', FunctionCalledEnum.UPDATE, token)
      ).toBe(false);
      expect(
        await svc.verifyPolicies('event', FunctionCalledEnum.DELETE, token)
      ).toBe(false);
    });
  });
});
