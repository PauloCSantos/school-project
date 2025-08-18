import {
  ICreateUserMasterInput,
  ICreateUserMasterOutput,
  IDeleteUserMasterInput,
  IDeleteUserMasterOutput,
  IFindAllUserMasterInput,
  IFindAllUserMasterOutput,
  IFindUserMasterInput,
  IFindUserMasterOutput,
  IUpdateUserMasterInput,
  IUpdateUserMasterOutput,
} from './base-master.dto';

export type FindUserMasterInputDto = IFindUserMasterInput;
export type FindUserMasterOutputDto = IFindUserMasterOutput;

export type FindAllUserMasterInputDto = IFindAllUserMasterInput;
export type FindAllUserMasterOutputDto = IFindAllUserMasterOutput;

export type CreateUserMasterInputDto = ICreateUserMasterInput;
export type CreateUserMasterOutputDto = ICreateUserMasterOutput;

export type UpdateUserMasterInputDto = IUpdateUserMasterInput;
export type UpdateUserMasterOutputDto = IUpdateUserMasterOutput;

export type DeleteUserMasterInputDto = IDeleteUserMasterInput;
export type DeleteUserMasterOutputDto = IDeleteUserMasterOutput;
