export interface FindUserWorkerInputDto {
  id: string;
}
export interface FindUserWorkerOutputDto {
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

export interface FindAllUserWorkerInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllUserWorkerOutputDto
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

export interface CreateUserWorkerInputDto {
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
export interface CreateUserWorkerOutputDto {
  id: string;
}

export interface UpdateUserWorkerInputDto {
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
export interface UpdateUserWorkerOutputDto {
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

export interface DeleteUserWorkerInputDto {
  id: string;
}
export interface DeleteUserWorkerOutputDto {
  message: string;
}
