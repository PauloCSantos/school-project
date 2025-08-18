import {
  IAddSubjectsInput,
  IAddSubjectsOutput,
  ICreateCurriculumInput,
  ICreateCurriculumOutput,
  IDeleteCurriculumInput,
  IDeleteCurriculumOutput,
  IFindAllCurriculumInput,
  IFindAllCurriculumOutput,
  IFindCurriculumInput,
  IFindCurriculumOutput,
  IRemoveSubjectsInput,
  IRemoveSubjectsOutput,
  IUpdateCurriculumInput,
  IUpdateCurriculumOutput,
} from './base-curriculum.dto';

export type FindCurriculumInputDto = IFindCurriculumInput;
export type FindCurriculumOutputDto = IFindCurriculumOutput;

export type FindAllCurriculumInputDto = IFindAllCurriculumInput;
export type FindAllCurriculumOutputDto = Array<IFindAllCurriculumOutput>;

export type CreateCurriculumInputDto = ICreateCurriculumInput;
export type CreateCurriculumOutputDto = ICreateCurriculumOutput;

export type UpdateCurriculumInputDto = IUpdateCurriculumInput;
export type UpdateCurriculumOutputDto = IUpdateCurriculumOutput;

export type DeleteCurriculumInputDto = IDeleteCurriculumInput;
export type DeleteCurriculumOutputDto = IDeleteCurriculumOutput;

export type AddSubjectsInputDto = IAddSubjectsInput;
export type AddSubjectsOutputDto = IAddSubjectsOutput;

export type RemoveSubjectsInputDto = IRemoveSubjectsInput;
export type RemoveSubjectsOutputDto = IRemoveSubjectsOutput;
