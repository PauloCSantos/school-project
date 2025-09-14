import { UserCreationModeEnum } from '../../domain/@shared/enums/creation-mode.enum';
import {
  ICreateUserMasterInput,
  ICreateUserMasterOutput,
  IDeleteUserMasterInput,
  IDeleteUserMasterOutput,
  IFindAllUserMasterInput,
  IFindUserMasterInput,
  IFindUserMasterOutput,
  IUpdateUserMasterInput,
  IUpdateUserMasterOutput,
} from './base-master.dto';
import {
  ICreateUserInput,
  ICreateUserOutput,
  IFindUserInput,
  IFindUserOutput,
  IUpdateUserInput,
  IUpdateUserOutput,
} from './base-user.dto';

type CreateUserMasterFull = {
  creationMode: UserCreationModeEnum.FULL;
} & ICreateUserInput &
  ICreateUserMasterInput;

export type CreateUserMasterInputDto = CreateUserMasterFull;
export type CreateUserMasterOutputDto = ICreateUserOutput & ICreateUserMasterOutput;

export type FindUserMasterInputDto = IFindUserInput & IFindUserMasterInput;
export type FindUserMasterOutputDto = IFindUserOutput & IFindUserMasterOutput;

export type FindAllUserMasterInputDto = IFindAllUserMasterInput;
export type FindAllUserMasterOutputDto = FindUserMasterOutputDto[];

export type UpdateUserMasterInputDto = IUpdateUserInput & IUpdateUserMasterInput;
export type UpdateUserMasterOutputDto = IUpdateUserOutput & IUpdateUserMasterOutput;

export type DeleteUserMasterInputDto = IDeleteUserMasterInput;
export type DeleteUserMasterOutputDto = IDeleteUserMasterOutput;
