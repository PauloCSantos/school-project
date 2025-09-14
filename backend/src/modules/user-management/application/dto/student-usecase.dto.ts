import { UserCreationModeEnum } from '../../domain/@shared/enums/creation-mode.enum';
import {
  ICreateUserStudentInput,
  ICreateUserStudentOutput,
  IDeleteUserStudentInput,
  IDeleteUserStudentOutput,
  IFindAllUserStudentInput,
  IFindUserStudentInput,
  IFindUserStudentOutput,
  IUpdateUserStudentInput,
  IUpdateUserStudentOutput,
} from './base-student.dto';
import {
  ICreateUserInput,
  ICreateUserOutput,
  IFindUserInput,
  IFindUserOutput,
  IUpdateUserInput,
  IUpdateUserOutput,
} from './base-user.dto';

type CreateUserStudentFull = {
  creationMode: UserCreationModeEnum.FULL;
} & ICreateUserInput &
  ICreateUserStudentInput;

type CreateUserStudentPartial = {
  creationMode: UserCreationModeEnum.PARTIAL;
} & Pick<ICreateUserInput, 'email'> &
  ICreateUserStudentInput;

export type CreateUserStudentInputDto = CreateUserStudentFull | CreateUserStudentPartial;
export type CreateUserStudentOutputDto = ICreateUserOutput & ICreateUserStudentOutput;

export type FindUserStudentInputDto = IFindUserInput & IFindUserStudentInput;
export type FindUserStudentOutputDto = IFindUserOutput & IFindUserStudentOutput;

export type FindAllUserStudentInputDto = IFindAllUserStudentInput;
export type FindAllUserStudentOutputDto = FindUserStudentOutputDto[];

export type UpdateUserStudentInputDto = IUpdateUserInput & IUpdateUserStudentInput;
export type UpdateUserStudentOutputDto = IUpdateUserOutput & IUpdateUserStudentOutput;

export type DeleteUserStudentInputDto = IDeleteUserStudentInput;
export type DeleteUserStudentOutputDto = IDeleteUserStudentOutput;
