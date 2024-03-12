import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
  LoginAuthUserInputDto,
  LoginAuthUserOutputDto,
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '@/application/dto/authentication-authorization-management/authUser-usecase.dto';
import CreateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/createAuthUser.usecase';
import DeleteAuthUser from '@/application/usecases/authentication-authorization-management/authUser/deleteAuthUser.usecase';
import FindAuthUser from '@/application/usecases/authentication-authorization-management/authUser/findAuthUser.usecase';
import LoginAuthUser from '@/application/usecases/authentication-authorization-management/authUser/loginAuthUser.usecase';
import UpdateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/updateAuthUser.usecase';

export default class AuthUserController {
  constructor(
    private readonly createAuthUser: CreateAuthUser,
    private readonly findAuthUser: FindAuthUser,
    private readonly updateAuthUser: UpdateAuthUser,
    private readonly deleteAuthUser: DeleteAuthUser,
    private readonly loginAuthUser: LoginAuthUser
  ) {}

  async create(
    input: CreateAuthUserInputDto
  ): Promise<CreateAuthUserOutputDto> {
    const response = await this.createAuthUser.execute(input);
    return response;
  }
  async find(
    input: FindAuthUserInputDto
  ): Promise<FindAuthUserOutputDto | undefined> {
    const response = await this.findAuthUser.execute(input);
    return response;
  }
  async delete(
    input: DeleteAuthUserInputDto
  ): Promise<DeleteAuthUserOutputDto> {
    const response = await this.deleteAuthUser.execute(input);
    return response;
  }
  async update(
    input: UpdateAuthUserInputDto
  ): Promise<UpdateAuthUserOutputDto> {
    const response = await this.updateAuthUser.execute(input);
    return response;
  }
  async login(input: LoginAuthUserInputDto): Promise<LoginAuthUserOutputDto> {
    const response = await this.loginAuthUser.execute(input);
    return response;
  }
}
