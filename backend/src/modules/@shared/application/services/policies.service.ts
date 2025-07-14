import {
  FunctionCalled,
  ModulesName,
  RoleUsers,
  RoleUsersEnum,
} from '../../type/sharedTypes';

export enum PermissionType {
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

export interface PoliciesServiceInterface {
  verifyPolicies(
    module: ModulesName,
    action: FunctionCalled,
    userToken?: TokenProps,
    data?: PolicyData
  ): Promise<boolean>;
}

export class PoliciesService implements PoliciesServiceInterface {
  private _policies: any = {};

  async verifyPolicies(
    module: ModulesName,
    action: FunctionCalled,
    userToken?: TokenProps,
    data?: PolicyData
  ): Promise<boolean> {
    if (!userToken) {
      if (
        module === 'authuser' &&
        action === 'create' &&
        data?.targetRole === RoleUsersEnum.MASTER
      ) {
        return true;
      }
      return false;
    }
    if (userToken.role === RoleUsersEnum.MASTER) return true;

    this._policies = this.loadPolicies(userToken.role);

    const modulePolicies = this._policies[module];
    if (!modulePolicies) return false;

    const permission = modulePolicies[action];
    if (!permission) return false;

    switch (permission) {
      case PermissionType.ALLOW:
      case true:
        return true;

      case PermissionType.DENY:
      case false:
        return false;

      case PermissionType.SELF:
        return data?.targetEmail === userToken.email;

      case PermissionType.EXCEPT_MASTER:
        return data?.targetRole !== RoleUsersEnum.MASTER;

      default:
        return false;
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
