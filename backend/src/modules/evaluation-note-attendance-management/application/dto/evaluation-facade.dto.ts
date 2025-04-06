export interface FindEvaluationInputDto {
  id: string;
}
export interface FindEvaluationOutputDto {
  id: string;
  teacher: string;
  lesson: string;
  type: string;
  value: number;
}

export interface FindAllEvaluationInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllEvaluationOutputDto
  extends Array<{
    id: string;
    teacher: string;
    lesson: string;
    type: string;
    value: number;
  }> {}

export interface CreateEvaluationInputDto {
  teacher: string;
  lesson: string;
  type: string;
  value: number;
}
export interface CreateEvaluationOutputDto {
  id: string;
}

export interface UpdateEvaluationInputDto {
  id: string;
  teacher?: string;
  lesson?: string;
  type?: string;
  value?: number;
}
export interface UpdateEvaluationOutputDto {
  id: string;
  teacher: string;
  lesson: string;
  type: string;
  value: number;
}

export interface DeleteEvaluationInputDto {
  id: string;
}
export interface DeleteEvaluationOutputDto {
  message: string;
}
