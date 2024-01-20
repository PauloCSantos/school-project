export interface FindUserMasterInputDto {
  id: string;
}
export interface FindUserMasterOutputDto {
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

export interface FindAllUserMasterInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllUserMasterOutputDto {
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
[];

export interface CreateUserMasterInputDto {
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
  cnpj: string;
}
export interface CreateUserMasterOutputDto {
  id: string;
}

export interface UpdateUserMasterInputDto {
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
export interface UpdateUserMasterOutputDto {
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

export interface DeleteUserMasterInputDto {
  id: string;
}
export interface DeleteUserMasterOutputDto {
  message: string;
}
