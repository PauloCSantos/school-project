import {
  IFindEventInput,
  IFindEventOutput,
  IFindAllEventInput,
  IFindAllEventOutput,
  ICreateEventInput,
  ICreateEventOutput,
  IUpdateEventInput,
  IUpdateEventOutput,
  IDeleteEventInput,
  IDeleteEventOutput,
} from './base-event.dto';

export type FindEventInputDto = IFindEventInput;
export type FindEventOutputDto = IFindEventOutput;

export type FindAllEventInputDto = IFindAllEventInput;
export type FindAllEventOutputDto = IFindAllEventOutput;

export type CreateEventInputDto = ICreateEventInput;
export type CreateEventOutputDto = ICreateEventOutput;

export type UpdateEventInputDto = IUpdateEventInput;
export type UpdateEventOutputDto = IUpdateEventOutput;

export type DeleteEventInputDto = IDeleteEventInput;
export type DeleteEventOutputDto = IDeleteEventOutput;
