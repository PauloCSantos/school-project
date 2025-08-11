import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '../enums/enums';

export type RoleUsers = (typeof RoleUsersEnum)[keyof typeof RoleUsersEnum];
export type ModulesName =
  (typeof ModulesNameEnum)[keyof typeof ModulesNameEnum];
export type FunctionCalled =
  (typeof FunctionCalledEnum)[keyof typeof FunctionCalledEnum];
//export type RoleUsers = `${RoleUsersEnum}`;
//export type FunctionCalled = `${FunctionCalledEnum}`;
//export type ModulesName = `${ModulesNameEnum}`;
export type TokenData = {
  email: string;
  role: RoleUsers;
  masterId: string;
};
