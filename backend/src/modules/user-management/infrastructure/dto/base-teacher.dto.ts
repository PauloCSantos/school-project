export interface IFindUserTeacherInput {
  id: string;
}
export interface IFindUserTeacherOutput {
  id: string;
  userId: string;
  salary: string;
  graduation: string;
  academicDegrees: string;
}

export interface IFindAllUserTeacherInput {
  quantity?: number;
  offset?: number;
}
export interface IFindAllUserTeacherOutput
  extends Array<{
    id: string;
    name: { fullName: string; shortName: string };
    address: {
      street: string;
      city: string;
      zip: string;
      number: number;
      avenue: string;
      state: string;
    };
    email: string;
    birthday: Date;
    salary: string;
    graduation: string;
    academicDegrees: string;
  }> {}

export interface ICreateUserTeacherInput {
  userId: string;
  name: { firstName: string; middleName?: string; lastName: string };
  address: {
    street: string;
    city: string;
    zip: string;
    number: number;
    avenue: string;
    state: string;
  };
  email: string;
  birthday: Date;
  salary: { salary: number; currency?: 'R$' | '€' | '$' };
  graduation: string;
  academicDegrees: string;
}
export interface ICreateUserTeacherOutput {
  id: string;
}

export interface IUpdateUserTeacherInput {
  id: string;
  name?: { firstName?: string; middleName?: string; lastName?: string };
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    number?: number;
    avenue?: string;
    state?: string;
  };
  email?: string;
  birthday?: Date;
  salary?: { salary?: number; currency?: 'R$' | '€' | '$' };
  graduation?: string;
  academicDegrees?: string;
}
export interface IUpdateUserTeacherOutput {
  id: string;
  name: { fullName: string; shortName: string };
  address: {
    street: string;
    city: string;
    zip: string;
    number: number;
    avenue: string;
    state: string;
  };
  email: string;
  birthday: Date;
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
