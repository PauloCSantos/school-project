export interface IFindUserTeacherInput {
  id: string;
}
export interface IFindUserTeacherOutput {
  id: string;
  salary: string;
  graduation: string;
  academicDegrees: string;
}

export interface IFindAllUserTeacherInput {
  quantity?: number;
  offset?: number;
}

export interface ICreateUserTeacherInput {
  salary: { salary: number; currency?: 'R$' | '€' | '$' };
  graduation: string;
  academicDegrees: string;
}
export interface ICreateUserTeacherOutput {
  id: string;
}

export interface IUpdateUserTeacherInput {
  id: string;
  salary?: { salary?: number; currency?: 'R$' | '€' | '$' };
  graduation?: string;
  academicDegrees?: string;
}
export interface IUpdateUserTeacherOutput {
  id: string;
  salary: string;
  graduation: string;
  academicDegrees: string;
}

export interface IDeleteUserTeacherInput {
  id: string;
}
export interface IDeleteUserTeacherOutput {
  message: string;
}
