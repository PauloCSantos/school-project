export interface IFindUserAdministratorOutput {
  id: string;
  userId: string;
  salary: { salary: number; currency: 'R$' | '€' | '$' };
  graduation: string;
  state: string;
}
