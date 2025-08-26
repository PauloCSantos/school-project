export interface IFindUserWorkerOutput {
  id: string;
  userId: string;
  salary: { salary: number; currency: 'R$' | '€' | '$' };
  state: string;
}
