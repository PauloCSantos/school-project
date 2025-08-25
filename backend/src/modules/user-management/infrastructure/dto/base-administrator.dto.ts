export interface IFindUserAdministratorInput {
  id: string;
}
export interface IFindUserAdministratorOutput {
  id: string;
  userId: string;
  salary: string;
  graduation: string;
}

export interface IFindAllUserAdministratorInput {
  quantity?: number;
  offset?: number;
}
export interface IFindAllUserAdministratorOutput
  extends Array<{
    id: string;
    userId: string;
    salary: string;
    graduation: string;
  }> {}

export interface ICreateUserAdministratorInput {
  userId: string;
  salary: { salary: number; currency?: 'R$' | '€' | '$' };
  graduation: string;
}
export interface ICreateUserAdministratorOutput {
  id: string;
}

export interface IUpdateUserAdministratorInput {
  id: string;
  salary?: { salary?: number; currency?: 'R$' | '€' | '$' };
  graduation?: string;
}
export interface IUpdateUserAdministratorOutput {
  id: string;
  salary: string;
  graduation: string;
}

export interface IDeleteUserAdministratorInput {
  id: string;
}
export interface IDeleteUserAdministratorOutput {
  message: string;
}
