export interface IFindTenantOutput {
  id: string;
  cnpj: string;
  tenantUsers: {
    email: string;
    role: string;
    state: string;
  }[];
}
