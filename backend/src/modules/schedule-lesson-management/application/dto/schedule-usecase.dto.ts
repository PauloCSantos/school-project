import {
  IFindScheduleInput,
  IFindScheduleOutput,
  IFindAllScheduleInput,
  IFindAllScheduleOutput,
  ICreateScheduleInput,
  ICreateScheduleOutput,
  IUpdateScheduleInput,
  IUpdateScheduleOutput,
  IDeleteScheduleInput,
  IDeleteScheduleOutput,
  IAddLessonsInput,
  IAddLessonsOutput,
  IRemoveLessonsInput,
  IRemoveLessonsOutput,
} from './base-schedule.dto';

// UseCase DTOs - utilizando as interfaces base

export type FindScheduleInputDto = IFindScheduleInput;
export type FindScheduleOutputDto = IFindScheduleOutput;

export type FindAllScheduleInputDto = IFindAllScheduleInput;
export type FindAllScheduleOutputDto = IFindAllScheduleOutput;

export type CreateScheduleInputDto = ICreateScheduleInput;
export type CreateScheduleOutputDto = ICreateScheduleOutput;

export type UpdateScheduleInputDto = IUpdateScheduleInput;
export type UpdateScheduleOutputDto = IUpdateScheduleOutput;

export type DeleteScheduleInputDto = IDeleteScheduleInput;
export type DeleteScheduleOutputDto = IDeleteScheduleOutput;

export type AddLessonsInputDto = IAddLessonsInput;
export type AddLessonsOutputDto = IAddLessonsOutput;

export type RemoveLessonsInputDto = IRemoveLessonsInput;
export type RemoveLessonsOutputDto = IRemoveLessonsOutput;
