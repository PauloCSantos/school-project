export interface MasterModel {
  id: string;
  name: string;
  email: string;
  role: 'master';
  cnpj?: string;
}
