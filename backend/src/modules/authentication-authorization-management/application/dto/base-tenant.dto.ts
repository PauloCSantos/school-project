export interface IFindTenantInput {
  id: string;
}

export interface IFindTenantOutput {
  id: string;
  cnpj: string;
}

export interface ICreateTenantInput {
  cnpj: string;
}

export interface IUpdateTenantInput {
  id: string;
  cnpj: string;
}

export interface IDeleteTenantInput {
  id: string;
}
