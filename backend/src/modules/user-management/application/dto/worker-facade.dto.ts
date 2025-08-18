import {
  ICreateUserWorkerInput,
  ICreateUserWorkerOutput,
  IDeleteUserWorkerInput,
  IDeleteUserWorkerOutput,
  IFindAllUserWorkerInput,
  IFindAllUserWorkerOutput,
  IFindUserWorkerInput,
  IFindUserWorkerOutput,
  IUpdateUserWorkerInput,
  IUpdateUserWorkerOutput,
} from './base-worker.dto';

export type FindUserWorkerInputDto = IFindUserWorkerInput;
export type FindUserWorkerOutputDto = IFindUserWorkerOutput;

export type FindAllUserWorkerInputDto = IFindAllUserWorkerInput;
export type FindAllUserWorkerOutputDto = IFindAllUserWorkerOutput;

export type CreateUserWorkerInputDto = ICreateUserWorkerInput;
export type CreateUserWorkerOutputDto = ICreateUserWorkerOutput;

export type UpdateUserWorkerInputDto = IUpdateUserWorkerInput;
export type UpdateUserWorkerOutputDto = IUpdateUserWorkerOutput;

export type DeleteUserWorkerInputDto = IDeleteUserWorkerInput;
export type DeleteUserWorkerOutputDto = IDeleteUserWorkerOutput;
