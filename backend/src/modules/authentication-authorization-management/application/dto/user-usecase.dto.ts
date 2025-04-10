import {
  IFindAuthUserInput,
  IFindAuthUserOutput,
  ICreateAuthUserInput,
  ICreateAuthUserOutput,
  IUpdateAuthUserInput,
  IUpdateAuthUserOutput,
  IDeleteAuthUserInput,
  IDeleteAuthUserOutput,
  ILoginAuthUserInput,
  ILoginAuthUserOutput,
} from './base-user.dto';

// UseCase DTOs - utilizando as interfaces base

export type FindAuthUserInputDto = IFindAuthUserInput;
export type FindAuthUserOutputDto = IFindAuthUserOutput;

export type CreateAuthUserInputDto = ICreateAuthUserInput;
export type CreateAuthUserOutputDto = ICreateAuthUserOutput;

export type UpdateAuthUserInputDto = IUpdateAuthUserInput;
export type UpdateAuthUserOutputDto = IUpdateAuthUserOutput;

export type DeleteAuthUserInputDto = IDeleteAuthUserInput;
export type DeleteAuthUserOutputDto = IDeleteAuthUserOutput;

export type LoginAuthUserInputDto = ILoginAuthUserInput;
export type LoginAuthUserOutputDto = ILoginAuthUserOutput;
