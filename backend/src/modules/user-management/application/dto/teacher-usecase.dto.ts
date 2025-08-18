import {
  ICreateUserTeacherInput,
  ICreateUserTeacherOutput,
  IDeleteUserTeacherInput,
  IDeleteUserTeacherOutput,
  IFindAllUserTeacherInput,
  IFindAllUserTeacherOutput,
  IFindUserTeacherInput,
  IFindUserTeacherOutput,
  IUpdateUserTeacherInput,
  IUpdateUserTeacherOutput,
} from './base-teacher.dto';

export type FindUserTeacherInputDto = IFindUserTeacherInput;
export type FindUserTeacherOutputDto = IFindUserTeacherOutput;

export type FindAllUserTeacherInputDto = IFindAllUserTeacherInput;
export type FindAllUserTeacherOutputDto = IFindAllUserTeacherOutput;

export type CreateUserTeacherInputDto = ICreateUserTeacherInput;
export type CreateUserTeacherOutputDto = ICreateUserTeacherOutput;

export type UpdateUserTeacherInputDto = IUpdateUserTeacherInput;
export type UpdateUserTeacherOutputDto = IUpdateUserTeacherOutput;

export type DeleteUserTeacherInputDto = IDeleteUserTeacherInput;
export type DeleteUserTeacherOutputDto = IDeleteUserTeacherOutput;
