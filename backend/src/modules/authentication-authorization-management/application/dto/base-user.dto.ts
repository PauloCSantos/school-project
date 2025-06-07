import { RoleUsers } from '@/modules/@shared/type/enum';

// Interfaces base para Find
export interface IFindAuthUserInput {
  email: string;
}

export interface IFindAuthUserOutput {
  email: string;
  masterId?: string;
  role: RoleUsers;
  isHashed: boolean;
}

// Interfaces base para Create
export interface ICreateAuthUserInput {
  email: string;
  password: string;
  masterId?: string;
  role: RoleUsers;
  isHashed?: boolean;
}

export interface ICreateAuthUserOutput {
  email: string;
  masterId: string;
}

// Interfaces base para Update
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

// Interfaces base para Delete
export interface IDeleteAuthUserInput {
  email: string;
}

export interface IDeleteAuthUserOutput {
  message: string;
}

// Interfaces base para Login
export interface ILoginAuthUserInput {
  email: string;
  password: string;
  role: RoleUsers;
}

export interface ILoginAuthUserOutput {
  token: string;
}
