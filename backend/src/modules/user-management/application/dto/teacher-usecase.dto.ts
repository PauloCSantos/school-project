export interface FindUserTeacherInputDto {
  id: string;
}
export interface FindUserTeacherOutputDto {
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

export interface FindAllUserTeacherInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllUserTeacherOutputDto
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

export interface CreateUserTeacherInputDto {
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
export interface CreateUserTeacherOutputDto {
  id: string;
}

export interface UpdateUserTeacherInputDto {
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
export interface UpdateUserTeacherOutputDto {
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

export interface DeleteUserTeacherInputDto {
  id: string;
}
export interface DeleteUserTeacherOutputDto {
  message: string;
}
