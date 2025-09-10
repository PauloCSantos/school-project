export interface AdministratorModel {
  id: string;
  name: string;
  email: string;
  role: 'administrator';
  graduation?: string;
}
