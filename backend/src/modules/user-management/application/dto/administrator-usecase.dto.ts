import {
  ICreateUserAdministratorInput,
  ICreateUserAdministratorOutput,
  IDeleteUserAdministratorInput,
  IDeleteUserAdministratorOutput,
  IFindAllUserAdministratorInput,
  IFindAllUserAdministratorOutput,
  IFindUserAdministratorInput,
  IFindUserAdministratorOutput,
  IUpdateUserAdministratorInput,
  IUpdateUserAdministratorOutput,
} from './base-administrator.dto';

export type FindUserAdministratorInputDto = IFindUserAdministratorInput;
export type FindUserAdministratorOutputDto = IFindUserAdministratorOutput;

export type FindAllUserAdministratorInputDto = IFindAllUserAdministratorInput;
export type FindAllUserAdministratorOutputDto = IFindAllUserAdministratorOutput;

export type CreateUserAdministratorInputDto = ICreateUserAdministratorInput;
export type CreateUserAdministratorOutputDto = ICreateUserAdministratorOutput;

export type UpdateUserAdministratorInputDto = IUpdateUserAdministratorInput;
export type UpdateUserAdministratorOutputDto = IUpdateUserAdministratorOutput;

export type DeleteUserAdministratorInputDto = IDeleteUserAdministratorInput;
export type DeleteUserAdministratorOutputDto = IDeleteUserAdministratorOutput;
