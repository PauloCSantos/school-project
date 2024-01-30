export interface FindUserStudentInputDto {
  id: string;
}
export interface FindUserStudentOutputDto {
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
  paymentYear: string;
}

export interface FindAllUserStudentInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllUserStudentOutputDto
  extends Array<{
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
    paymentYear: string;
  }> {}

export interface CreateUserStudentInputDto {
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
  paymentYear: number;
}
export interface CreateUserStudentOutputDto {
  id: string;
}

export interface UpdateUserStudentInputDto {
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
  paymentYear?: number;
}
export interface UpdateUserStudentOutputDto {
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
  paymentYear: string;
}

export interface DeleteUserStudentInputDto {
  id: string;
}
export interface DeleteUserStudentOutputDto {
  message: string;
}
