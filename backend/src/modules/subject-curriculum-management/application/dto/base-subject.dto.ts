export interface IFindSubjectInput {
  id: string;
}
export interface IFindSubjectOutput {
  id: string;
  name: string;
  description: string;
}

export interface IFindAllSubjectInput {
  quantity?: number;
  offset?: number;
}
export interface IFindAllSubjectOutput {
  id: string;
  name: string;
  description: string;
}

export interface ICreateSubjectInput {
  name: string;
  description: string;
}
export interface ICreateSubjectOutput {
  id: string;
}

export interface IUpdateSubjectInput {
  id: string;
  name?: string;
  description?: string;
}
export interface IUpdateSubjectOutput {
  id: string;
  name: string;
  description: string;
}

export interface IDeleteSubjectInput {
  id: string;
}
export interface IDeleteSubjectOutput {
  message: string;
}
