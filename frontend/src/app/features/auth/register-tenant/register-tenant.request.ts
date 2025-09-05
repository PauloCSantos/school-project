export interface RegisterTenantRequest {
  email: string;
  cnpj: string;
  password: string;
  role: 'master';
}
