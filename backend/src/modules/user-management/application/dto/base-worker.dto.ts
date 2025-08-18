export interface IFindUserWorkerInput {
  id: string;
}
export interface IFindUserWorkerOutput {
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
}

export interface IFindAllUserWorkerInput {
  quantity?: number;
  offset?: number;
}
export interface IFindAllUserWorkerOutput
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
  }> {}

export interface ICreateUserWorkerInput {
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
}
export interface ICreateUserWorkerOutput {
  id: string;
}

export interface IUpdateUserWorkerInput {
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
}
export interface IUpdateUserWorkerOutput {
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
}

export interface IDeleteUserWorkerInput {
  id: string;
}
export interface IDeleteUserWorkerOutput {
  message: string;
}
