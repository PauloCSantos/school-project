export interface FindUserAdministratorInputDto {
  id: string;
}
export interface FindUserAdministratorOutputDto {
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
}

export interface FindAllUserAdministratorInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllUserAdministratorOutputDto
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
    salary: string;
    graduation: string;
  }> {}

export interface CreateUserAdministratorInputDto {
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
}
export interface CreateUserAdministratorOutputDto {
  id: string;
}

export interface UpdateUserAdministratorInputDto {
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
}
export interface UpdateUserAdministratorOutputDto {
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
}

export interface DeleteUserAdministratorInputDto {
  id: string;
}
export interface DeleteUserAdministratorOutputDto {
  message: string;
}
