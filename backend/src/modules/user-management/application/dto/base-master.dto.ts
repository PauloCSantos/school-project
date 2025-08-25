export interface IFindUserMasterInput {
  id: string;
}
export interface IFindUserMasterOutput {
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
  cnpj: string;
}

export interface IFindAllUserMasterInput {
  quantity?: number;
  offset?: number;
}
export interface IFindAllUserMasterOutput
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
    cnpj: string;
  }> {}

export interface ICreateUserMasterInput {
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
  cnpj: string;
}
export interface ICreateUserMasterOutput {
  id: string;
}

export interface IUpdateUserMasterInput {
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
  cnpj?: string;
}
export interface IUpdateUserMasterOutput {
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
  cnpj: string;
}

export interface IDeleteUserMasterInput {
  id: string;
}
export interface IDeleteUserMasterOutput {
  message: string;
}
