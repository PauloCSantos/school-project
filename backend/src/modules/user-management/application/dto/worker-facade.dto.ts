import {
  ICreateUserWorkerInput,
  ICreateUserWorkerOutput,
  IDeleteUserWorkerInput,
  IDeleteUserWorkerOutput,
  IFindAllUserWorkerInput,
  IFindUserWorkerInput,
  IFindUserWorkerOutput,
  IUpdateUserWorkerInput,
  IUpdateUserWorkerOutput,
} from './base-worker.dto';
import {
  ICreateUserInput,
  ICreateUserOutput,
  IFindUserInput,
  IFindUserOutput,
  IUpdateUserInput,
  IUpdateUserOutput,
} from './base-user.dto';
import { UserCreationModeEnum } from '../../domain/@shared/enums/creation-mode.enum';

type CreateUserWorkerFull = {
  creationMode: UserCreationModeEnum.FULL;
} & ICreateUserInput &
  ICreateUserWorkerInput;

export type CreateUserWorkerInputDto = CreateUserWorkerFull;
export type CreateUserWorkerOutputDto = ICreateUserOutput & ICreateUserWorkerOutput;

export type FindUserWorkerInputDto = IFindUserInput & IFindUserWorkerInput;
export type FindUserWorkerOutputDto = IFindUserOutput & IFindUserWorkerOutput;

export type FindAllUserWorkerInputDto = IFindAllUserWorkerInput;
export type FindAllUserWorkerOutputDto = FindUserWorkerOutputDto[];

export type UpdateUserWorkerInputDto = IUpdateUserInput & IUpdateUserWorkerInput;
export type UpdateUserWorkerOutputDto = IUpdateUserOutput & IUpdateUserWorkerOutput;

export type DeleteUserWorkerInputDto = IDeleteUserWorkerInput;
export type DeleteUserWorkerOutputDto = IDeleteUserWorkerOutput;
