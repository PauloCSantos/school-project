import { RoleUsers } from '@/modules/@shared/type/sharedTypes';

export interface IFindAuthUserInput {
  email: string;
}

export interface IFindAuthUserOutput {
  email: string;
}

export interface ICreateAuthUserInput {
  email: string;
  password: string;
  role: RoleUsers;
  cnpj?: string;
}

export interface ICreateAuthUserOutput {
  email: string;
  masterId: string;
}

export interface IUpdateAuthUserInput {
  email: string;
  authUserDataToUpdate: {
    email?: string;
    password?: string;
    role?: RoleUsers;
  };
}

export interface IUpdateAuthUserOutput {
  email: string;
  role: RoleUsers;
}

export interface IDeleteAuthUserInput {
  email: string;
}

export interface IDeleteAuthUserOutput {
  message: string;
}

export interface ILoginAuthUserInput {
  email: string;
  password: string;
  masterId?: string;
  role?: RoleUsers;
}

export interface ILoginAuthUserOutput {
  token?: string;
  data?: {
    id: string;
    roles: RoleUsers[];
  }[];
}
