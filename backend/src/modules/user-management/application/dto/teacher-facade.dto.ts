import { UserCreationModeEnum } from '../../domain/@shared/enums/creation-mode.enum';
import {
  ICreateUserTeacherInput,
  ICreateUserTeacherOutput,
  IDeleteUserTeacherInput,
  IDeleteUserTeacherOutput,
  IFindAllUserTeacherInput,
  IFindUserTeacherInput,
  IFindUserTeacherOutput,
  IUpdateUserTeacherInput,
  IUpdateUserTeacherOutput,
} from './base-teacher.dto';
import {
  ICreateUserInput,
  ICreateUserOutput,
  IFindUserInput,
  IFindUserOutput,
  IUpdateUserInput,
  IUpdateUserOutput,
} from './base-user.dto';

type CreateUserTeacherFull = {
  creationMode: UserCreationModeEnum.FULL;
} & ICreateUserInput &
  ICreateUserTeacherInput;

export type CreateUserTeacherInputDto = CreateUserTeacherFull;
export type CreateUserTeacherOutputDto = ICreateUserOutput & ICreateUserTeacherOutput;

export type FindUserTeacherInputDto = IFindUserInput & IFindUserTeacherInput;
export type FindUserTeacherOutputDto = IFindUserOutput & IFindUserTeacherOutput;

export type FindAllUserTeacherInputDto = IFindAllUserTeacherInput;
export type FindAllUserTeacherOutputDto = FindUserTeacherOutputDto[];

export type UpdateUserTeacherInputDto = IUpdateUserInput & IUpdateUserTeacherInput;
export type UpdateUserTeacherOutputDto = IUpdateUserOutput & IUpdateUserTeacherOutput;

export type DeleteUserTeacherInputDto = IDeleteUserTeacherInput;
export type DeleteUserTeacherOutputDto = IDeleteUserTeacherOutput;
