import {
  ErrorKindEnum,
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
  StatesEnum,
} from '../enums/enums';

export type RoleUsers = (typeof RoleUsersEnum)[keyof typeof RoleUsersEnum];
export type ModulesName = (typeof ModulesNameEnum)[keyof typeof ModulesNameEnum];
export type FunctionCalled = (typeof FunctionCalledEnum)[keyof typeof FunctionCalledEnum];
export type States = (typeof StatesEnum)[keyof typeof StatesEnum];
export type ErrorKind = (typeof ErrorKindEnum)[keyof typeof ErrorKindEnum];
export type TokenData = {
  email: string;
  role: RoleUsers;
  masterId: string;
};
export type ErrorBody = {
  code: string;
  message: string;
  details?: { field?: string };
};
