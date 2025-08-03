import { RoleUsersEnum } from '../../enums/enums';
import { FunctionCalled, ModulesName, RoleUsers } from '../../type/sharedTypes';

enum PermissionType {
  ALLOW = 'allow',
  DENY = 'deny',
  SELF = 'self',
  EXCEPT_MASTER = 'except-master',
}

type TokenProps = {
  email: string;
  role: RoleUsers;
  masterId: string;
};

type PolicyData = {
  targetEmail?: string;
  targetRole?: RoleUsers;
};

class AccessDeniedException extends Error {
  constructor(
    public readonly module: ModulesName,
    public readonly action: FunctionCalled,
    public readonly reason: string,
    public readonly userRole?: RoleUsers
  ) {
    super(`Access denied for ${module}.${action}: ${reason}`);
    this.name = 'AccessDeniedException';
  }
}

class UnauthorizedException extends Error {
  constructor(message: string = 'User not authenticated') {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

export interface PoliciesServiceInterface {
  verifyPolicies(
    module: ModulesName,
    action: FunctionCalled,
    userToken?: TokenProps,
    data?: PolicyData
  ): Promise<void>;
}

export class PoliciesService implements PoliciesServiceInterface {
  private _policies: any = {};

  async verifyPolicies(
    module: ModulesName,
    action: FunctionCalled,
    userToken?: TokenProps,
    data?: PolicyData
  ): Promise<void> {
    if (!userToken) {
      if (
        module === 'authuser' &&
        action === 'create' &&
        data?.targetRole === RoleUsersEnum.MASTER
      ) {
        return;
      }
      throw new UnauthorizedException(
        'Authentication required for this operation'
      );
    }

    if (userToken.role === RoleUsersEnum.MASTER) {
      return;
    }

    this._policies = this.loadPolicies(userToken.role);

    const modulePolicies = this._policies[module];
    if (!modulePolicies) {
      throw new AccessDeniedException(
        module,
        action,
        `Module '${module}' not accessible for role '${userToken.role}'`,
        userToken.role
      );
    }

    const permission = modulePolicies[action];
    if (!permission) {
      throw new AccessDeniedException(
        module,
        action,
        `Action '${action}' not permitted for role '${userToken.role}' in module '${module}'`,
        userToken.role
      );
    }

    switch (permission) {
      case PermissionType.ALLOW:
      case true:
        return;

      case PermissionType.DENY:
      case false:
        throw new AccessDeniedException(
          module,
          action,
          `Explicitly denied for role '${userToken.role}'`,
          userToken.role
        );

      case PermissionType.SELF:
        if (data?.targetEmail !== userToken.email) {
          throw new AccessDeniedException(
            module,
            action,
            `Self-only permission: can only access own resources`,
            userToken.role
          );
        }
        return;

      case PermissionType.EXCEPT_MASTER:
        if (data?.targetRole === RoleUsersEnum.MASTER) {
          throw new AccessDeniedException(
            module,
            action,
            `Cannot perform action on MASTER role`,
            userToken.role
          );
        }
        return;

      default:
        throw new AccessDeniedException(
          module,
          action,
          `Unknown permission type: ${permission}`,
          userToken.role
        );
    }
  }

  private loadPolicies(role: RoleUsers) {
    switch (role) {
      case 'administrator':
        return {
          authuser: {
            create: PermissionType.EXCEPT_MASTER,
            find: PermissionType.EXCEPT_MASTER,
            update: PermissionType.EXCEPT_MASTER,
            delete: PermissionType.EXCEPT_MASTER,
          },
          administrator: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          teacher: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          student: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          worker: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          subject: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          curriculum: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
            add: PermissionType.ALLOW,
            remove: PermissionType.ALLOW,
          },
          schedule: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
            add: PermissionType.ALLOW,
            remove: PermissionType.ALLOW,
          },
          lesson: {
            create: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
            add: PermissionType.ALLOW,
            remove: PermissionType.ALLOW,
          },
          event: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          evaluation: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          note: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          attendance: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
            add: PermissionType.ALLOW,
            remove: PermissionType.ALLOW,
          },
        };

      case 'teacher':
        return {
          authuser: {
            find: PermissionType.SELF,
            update: PermissionType.SELF,
          },
          teacher: {
            find: PermissionType.SELF,
            update: PermissionType.SELF,
          },
          student: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          subject: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          curriculum: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          schedule: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          lesson: {
            create: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            add: PermissionType.ALLOW,
            remove: PermissionType.ALLOW,
          },
          event: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
          },
          evaluation: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          note: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
          },
          attendance: {
            create: PermissionType.ALLOW,
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
            update: PermissionType.ALLOW,
            delete: PermissionType.ALLOW,
            add: PermissionType.ALLOW,
            remove: PermissionType.ALLOW,
          },
        };

      case 'student':
        return {
          authuser: {
            find: PermissionType.SELF,
            update: PermissionType.SELF,
          },
          teacher: {
            find: PermissionType.ALLOW,
          },
          student: {
            find: PermissionType.SELF,
            update: PermissionType.SELF,
          },
          subject: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          curriculum: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          schedule: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          lesson: {
            find: PermissionType.ALLOW,
          },
          event: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
          evaluation: {
            find: PermissionType.ALLOW,
          },
          note: {
            find: PermissionType.ALLOW,
          },
          attendance: {
            find: PermissionType.ALLOW,
          },
        };

      case 'worker':
        return {
          authuser: {
            find: PermissionType.SELF,
            update: PermissionType.SELF,
          },
          worker: {
            find: PermissionType.SELF,
            update: PermissionType.SELF,
          },
          event: {
            findAll: PermissionType.ALLOW,
            find: PermissionType.ALLOW,
          },
        };

      default:
        return {};
    }
  }
}
