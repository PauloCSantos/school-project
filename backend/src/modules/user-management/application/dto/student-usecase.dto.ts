import {
  ICreateUserStudentInput,
  ICreateUserStudentOutput,
  IDeleteUserStudentInput,
  IDeleteUserStudentOutput,
  IFindAllUserStudentInput,
  IFindAllUserStudentOutput,
  IFindUserStudentInput,
  IFindUserStudentOutput,
  IUpdateUserStudentInput,
  IUpdateUserStudentOutput,
} from './base-student.dto';

export type FindUserStudentInputDto = IFindUserStudentInput;
export type FindUserStudentOutputDto = IFindUserStudentOutput;

export type FindAllUserStudentInputDto = IFindAllUserStudentInput;
export type FindAllUserStudentOutputDto = IFindAllUserStudentOutput;

export type CreateUserStudentInputDto = ICreateUserStudentInput;
export type CreateUserStudentOutputDto = ICreateUserStudentOutput;

export type UpdateUserStudentInputDto = IUpdateUserStudentInput;
export type UpdateUserStudentOutputDto = IUpdateUserStudentOutput;

export type DeleteUserStudentInputDto = IDeleteUserStudentInput;
export type DeleteUserStudentOutputDto = IDeleteUserStudentOutput;
