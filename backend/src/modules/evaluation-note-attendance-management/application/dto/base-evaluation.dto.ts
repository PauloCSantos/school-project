export interface IFindEvaluationInput {
  id: string;
}

export interface IFindEvaluationOutput {
  id: string;
  teacher: string;
  lesson: string;
  type: string;
  value: number;
}

export interface IFindAllEvaluationInput {
  quantity?: number;
  offset?: number;
}

export interface IFindAllEvaluationItemOutput {
  id: string;
  teacher: string;
  lesson: string;
  type: string;
  value: number;
}

export interface ICreateEvaluationInput {
  teacher: string;
  lesson: string;
  type: string;
  value: number;
}

export interface ICreateEvaluationOutput {
  id: string;
}

export interface IUpdateEvaluationInput {
  id: string;
  teacher?: string;
  lesson?: string;
  type?: string;
  value?: number;
}

export interface IUpdateEvaluationOutput {
  id: string;
  teacher: string;
  lesson: string;
  type: string;
  value: number;
}

export interface IDeleteEvaluationInput {
  id: string;
}

export interface IDeleteEvaluationOutput {
  message: string;
}
