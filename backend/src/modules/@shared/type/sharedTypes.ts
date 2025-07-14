export type RoleUsers = `${RoleUsersEnum}`;
export enum RoleUsersEnum {
  MASTER = 'master',
  ADMINISTRATOR = 'administrator',
  TEACHER = 'teacher',
  WORKER = 'worker',
  STUDENT = 'student',
}

export type FunctionCalled = `${FunctionCalledEnum}`;
export enum FunctionCalledEnum {
  FIND_ALL = 'findAll',
  FIND = 'find',
  DELETE = 'delete',
  CREATE = 'create',
  UPDATE = 'update',
  ADD = 'add',
  REMOVE = 'remove',
}

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

export type TokenData = {
  email: string;
  role: RoleUsers;
  masterId: string;
};

export type ModulesName = `${ModulesNameEnum}`;
export enum ModulesNameEnum {
  AUTHUSER = 'authuser',
  MASTER = 'master',
  ADMINISTRATOR = 'administrator',
  TEACHER = 'teacher',
  STUDENT = 'student',
  WORKER = 'worker',
  SUBJECT = 'subject',
  CURRICULUM = 'curriculum',
  SCHEDULE = 'schedule',
  LESSON = 'lesson',
  EVENT = 'event',
  EVALUATION = 'evaluation',
  NOTE = 'note',
  ATTENDANCE = 'attendance',
}

export enum HttpStatus {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessage {
  MISSING_TOKEN = 'Missing Token',
  INVALID_TOKEN = 'Invalid token',
  ACCESS_DENIED = 'User does not have access permission',
  INTERNAL_ERROR = 'Internal server error',
}
