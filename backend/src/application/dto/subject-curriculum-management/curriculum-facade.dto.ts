export interface FindCurriculumInputDto {
  id: string;
}
export interface FindCurriculumOutputDto {
  id: string;
  name: string;
  yearsToComplete: number;
  subjectsList: string[];
}

export interface FindAllCurriculumInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllCurriculumOutputDto
  extends Array<{
    id: string;
    name: string;
    yearsToComplete: number;
    subjectsList: string[];
  }> {}

export interface CreateCurriculumInputDto {
  name: string;
  yearsToComplete: number;
  subjectsList: string[];
}
export interface CreateCurriculumOutputDto {
  id: string;
}

export interface UpdateCurriculumInputDto {
  id: string;
  name?: string;
  yearsToComplete?: number;
}
export interface UpdateCurriculumOutputDto {
  id: string;
  name: string;
  yearsToComplete: number;
}

export interface DeleteCurriculumInputDto {
  id: string;
}
export interface DeleteCurriculumOutputDto {
  message: string;
}

export interface AddSubjectsInputDto {
  id: string;
  newSubjectsList: string[];
}
export interface AddSubjectsOutputDto {
  message: string;
}

export interface RemoveSubjectsInputDto {
  id: string;
  subjectsListToRemove: string[];
}
export interface RemoveSubjectsOutputDto {
  message: string;
}
