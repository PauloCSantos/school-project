export interface IFindUserTeacherOutput {
  id: string;
  userId: string;
  salary: { salary: number; currency: 'R$' | '€' | '$' };
  graduation: string;
  academicDegrees: string;
  state: string;
}
