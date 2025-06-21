export enum RoleUsersEnum {
  MASTER = 'master',
  ADMINISTRATOR = 'administrator',
  TEACHER = 'teacher',
  WORKER = 'worker',
  STUDENT = 'student',
}

export type RoleUsers = `${RoleUsersEnum}`;

export enum StatusCodeEnum {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
}

export enum StatusMessageEnum {
  OK = 'OK',
  CREATED = 'Created',
  NO_CONTENT = 'No Content',
  NOT_FOUND = 'Not Found',
}
