export interface FindAuthUserInputDto {
  email: string;
}
export interface FindAuthUserOutputDto {
  email: string;
  password: string;
  masterId?: string;
  role: RoleUsers;
  isHashed: boolean;
}

export interface CreateAuthUserInputDto {
  email: string;
  password: string;
  masterId?: string;
  role: RoleUsers;
  isHashed?: boolean;
}
export interface CreateAuthUserOutputDto {
  email: string;
}

export interface UpdateAuthUserInputDto {
  email: string;
  authUserDataToUpdate: {
    email?: string;
    password?: string;
    role?: RoleUsers;
  };
}
export interface UpdateAuthUserOutputDto {
  email: string;
  password: string;
  role: RoleUsers;
}

export interface DeleteAuthUserInputDto {
  email: string;
}
export interface DeleteAuthUserOutputDto {
  message: string;
}
