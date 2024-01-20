export interface FindUserTeacherInputDto {
  id: string;
}
export interface FindUserTeacherOutputDto {
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
export interface FindAllUserTeacherOutputDto {
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
[];

export interface CreateUserTeacherInputDto {
  id: string;
  name: { firstName: string; middleName: string; lastName: string };
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
