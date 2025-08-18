import {
  IFindAllSubjectInput,
  IFindAllSubjectOutput,
  IFindSubjectInput,
  IFindSubjectOutput,
  ICreateSubjectInput,
  ICreateSubjectOutput,
  IDeleteSubjectInput,
  IDeleteSubjectOutput,
  IUpdateSubjectInput,
  IUpdateSubjectOutput,
} from './base-subject.dto';

export type FindSubjectInputDto = IFindSubjectInput;
export type FindSubjectOutputDto = IFindSubjectOutput;

export type FindAllSubjectInputDto = IFindAllSubjectInput;
export type FindAllSubjectOutputDto = Array<IFindAllSubjectOutput>;

export type CreateSubjectInputDto = ICreateSubjectInput;
export type CreateSubjectOutputDto = ICreateSubjectOutput;

export type UpdateSubjectInputDto = IUpdateSubjectInput;
export type UpdateSubjectOutputDto = IUpdateSubjectOutput;

export type DeleteSubjectInputDto = IDeleteSubjectInput;
export type DeleteSubjectOutputDto = IDeleteSubjectOutput;
