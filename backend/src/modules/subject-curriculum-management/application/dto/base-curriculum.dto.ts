export interface IFindCurriculumInput {
  id: string;
}
export interface IFindCurriculumOutput {
  id: string;
  name: string;
  yearsToComplete: number;
  subjectsList: string[];
}

export interface IFindAllCurriculumInput {
  quantity?: number;
  offset?: number;
}
export interface IFindAllCurriculumOutput {
  id: string;
  name: string;
  yearsToComplete: number;
  subjectsList: string[];
}

export interface ICreateCurriculumInput {
  name: string;
  yearsToComplete: number;
  subjectsList: string[];
}
export interface ICreateCurriculumOutput {
  id: string;
}

export interface IUpdateCurriculumInput {
  id: string;
  name?: string;
  yearsToComplete?: number;
}
export interface IUpdateCurriculumOutput {
  id: string;
  name: string;
  yearsToComplete: number;
}

export interface IDeleteCurriculumInput {
  id: string;
}
export interface IDeleteCurriculumOutput {
  message: string;
}

export interface IAddSubjectsInput {
  id: string;
  newSubjectsList: string[];
}
export interface IAddSubjectsOutput {
  message: string;
}

export interface IRemoveSubjectsInput {
  id: string;
  subjectsListToRemove: string[];
}
export interface IRemoveSubjectsOutput {
  message: string;
}
