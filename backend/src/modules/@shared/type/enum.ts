export enum RoleUsersEnum {
  MASTER = 'master',
  ADMINISTRATOR = 'administrator',
  TEACHER = 'teacher',
  WORKER = 'worker',
  STUDENT = 'student',
}

export type RoleUsers = `${RoleUsersEnum}`;
