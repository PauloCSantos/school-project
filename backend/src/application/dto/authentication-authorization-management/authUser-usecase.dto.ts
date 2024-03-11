export interface FindAuthUserInputDto {
  email: string;
}
export interface FindAuthUserOutputDto {
  email: string;
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
  masterId: string;
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
  role: RoleUsers;
}

export interface DeleteAuthUserInputDto {
  email: string;
}
export interface DeleteAuthUserOutputDto {
  message: string;
}

export interface LoginAuthUserInputDto {
  email: string;
  password: string;
  role: RoleUsers;
}
export interface LoginAuthUserOutputDto {
  token: string;
}
