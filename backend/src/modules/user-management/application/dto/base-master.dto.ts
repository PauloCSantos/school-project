export interface IFindUserMasterInput {
  id: string;
}
export interface IFindUserMasterOutput {
  id: string;
  cnpj: string;
}

export interface IFindAllUserMasterInput {
  quantity?: number;
  offset?: number;
}

export interface ICreateUserMasterInput {
  cnpj: string;
}
export interface ICreateUserMasterOutput {
  id: string;
}

export interface IUpdateUserMasterInput {
  id: string;
  cnpj?: string;
}
export interface IUpdateUserMasterOutput {
  id: string;
  cnpj: string;
}

export interface IDeleteUserMasterInput {
  id: string;
}
export interface IDeleteUserMasterOutput {
  message: string;
}
