import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
  StatesEnum,
} from '../enums/enums';

export type RoleUsers = (typeof RoleUsersEnum)[keyof typeof RoleUsersEnum];
export type ModulesName = (typeof ModulesNameEnum)[keyof typeof ModulesNameEnum];
export type FunctionCalled = (typeof FunctionCalledEnum)[keyof typeof FunctionCalledEnum];
export type States = (typeof StatesEnum)[keyof typeof StatesEnum];
export type TokenData = {
  email: string;
  role: RoleUsers;
  masterId: string;
};
