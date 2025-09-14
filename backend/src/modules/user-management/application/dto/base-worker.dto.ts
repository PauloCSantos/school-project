export interface IFindUserWorkerInput {
  id: string;
}
export interface IFindUserWorkerOutput {
  id: string;
  salary: string;
}

export interface IFindAllUserWorkerInput {
  quantity?: number;
  offset?: number;
}

export interface ICreateUserWorkerInput {
  salary: { salary: number; currency?: 'R$' | '€' | '$' };
}
export interface ICreateUserWorkerOutput {
  id: string;
}

export interface IUpdateUserWorkerInput {
  id: string;
  salary?: { salary?: number; currency?: 'R$' | '€' | '$' };
}
export interface IUpdateUserWorkerOutput {
  id: string;
  salary: string;
}

export interface IDeleteUserWorkerInput {
  id: string;
}
export interface IDeleteUserWorkerOutput {
  message: string;
}
