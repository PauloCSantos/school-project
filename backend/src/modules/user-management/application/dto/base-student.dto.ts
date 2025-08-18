export interface IFindUserStudentInput {
  id: string;
}
export interface IFindUserStudentOutput {
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
  paymentYear: number;
}

export interface IFindAllUserStudentInput {
  quantity?: number;
  offset?: number;
}
export interface IFindAllUserStudentOutput
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
    paymentYear: number;
  }> {}

export interface ICreateUserStudentInput {
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
export interface ICreateUserStudentOutput {
  id: string;
}

export interface IUpdateUserStudentInput {
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
export interface IUpdateUserStudentOutput {
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
  paymentYear: number;
}

export interface IDeleteUserStudentInput {
  id: string;
}
export interface IDeleteUserStudentOutput {
  message: string;
}
