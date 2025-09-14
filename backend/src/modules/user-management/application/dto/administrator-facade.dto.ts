import { UserCreationModeEnum } from '../../domain/@shared/enums/creation-mode.enum';
import {
  ICreateUserAdministratorInput,
  ICreateUserAdministratorOutput,
  IDeleteUserAdministratorInput,
  IDeleteUserAdministratorOutput,
  IFindAllUserAdministratorInput,
  IFindUserAdministratorInput,
  IFindUserAdministratorOutput,
  IUpdateUserAdministratorInput,
  IUpdateUserAdministratorOutput,
} from './base-administrator.dto';
import {
  IFindUserInput,
  IFindUserOutput,
  ICreateUserInput,
  ICreateUserOutput,
  IUpdateUserInput,
  IUpdateUserOutput,
  IDeleteUserInput,
  IDeleteUserOutput,
} from './base-user.dto';

type CreateUserAdministratorFull = {
  creationMode: UserCreationModeEnum.FULL;
} & ICreateUserInput &
  ICreateUserAdministratorInput;

export type CreateUserAdministratorInputDto = CreateUserAdministratorFull;
export type CreateUserAdministratorOutputDto = ICreateUserOutput &
  ICreateUserAdministratorOutput;

export type FindUserAdministratorInputDto = IFindUserInput & IFindUserAdministratorInput;
export type FindUserAdministratorOutputDto = IFindUserOutput &
  IFindUserAdministratorOutput;

export type FindAllUserAdministratorInputDto = IFindAllUserAdministratorInput;
export type FindAllUserAdministratorOutputDto = FindUserAdministratorOutputDto[];

export type UpdateUserAdministratorInputDto = IUpdateUserInput &
  IUpdateUserAdministratorInput;
export type UpdateUserAdministratorOutputDto = IUpdateUserOutput &
  IUpdateUserAdministratorOutput;

export type DeleteUserAdministratorInputDto = IDeleteUserInput &
  IDeleteUserAdministratorInput;
export type DeleteUserAdministratorOutputDto = IDeleteUserOutput &
  IDeleteUserAdministratorOutput;
