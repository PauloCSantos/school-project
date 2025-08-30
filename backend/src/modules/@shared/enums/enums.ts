export enum RoleUsersEnum {
  MASTER = 'master',
  ADMINISTRATOR = 'administrator',
  TEACHER = 'teacher',
  WORKER = 'worker',
  STUDENT = 'student',
}

export enum FunctionCalledEnum {
  FIND_ALL = 'findAll',
  FIND = 'find',
  DELETE = 'delete',
  CREATE = 'create',
  UPDATE = 'update',
  ADD = 'add',
  REMOVE = 'remove',
}

export enum StatusMessageEnum {
  OK = 'OK',
  CREATED = 'Created',
  NO_CONTENT = 'No Content',
  NOT_FOUND = 'Not Found',
}

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
  TENANT = 'tenant',
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum ErrorMessage {
  MISSING_TOKEN = 'Missing Token',
  INVALID_TOKEN = 'Invalid token',
  ACCESS_DENIED = 'User does not have access permission',
  INTERNAL_ERROR = 'Internal server error',
}

export enum StatesEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum ErrorKindEnum {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION = 'VALIDATION',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTEGRATION = 'INTEGRATION',
  INTERNAL = 'INTERNAL',
}
