import CreateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/createAuthUser.usecase';
import DeleteAuthUser from '@/application/usecases/authentication-authorization-management/authUser/deleteAuthUser.usecase';
import FindAuthUser from '@/application/usecases/authentication-authorization-management/authUser/findAuthUser.usecase';
import UpdateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/updateAuthUser.usecase';
import AuthUserFacadeInterface from '../interface/authUser-facade.interface';
import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '@/application/dto/authentication-authorization-management/authUser-facade.dto';

type AuthUserFacadeProps = {
  createAuthUser: CreateAuthUser;
  deleteAuthUser: DeleteAuthUser;
  findAuthUser: FindAuthUser;
  updateAuthUser: UpdateAuthUser;
};
export default class AuthUserFacade implements AuthUserFacadeInterface {
  private _createAuthUser: CreateAuthUser;
  private _deleteAuthUser: DeleteAuthUser;
  private _findAuthUser: FindAuthUser;
  private _updateAuthUser: UpdateAuthUser;

  constructor(input: AuthUserFacadeProps) {
    this._createAuthUser = input.createAuthUser;
    this._deleteAuthUser = input.deleteAuthUser;
    this._findAuthUser = input.findAuthUser;
    this._updateAuthUser = input.updateAuthUser;
  }

  async create(
    input: CreateAuthUserInputDto
  ): Promise<CreateAuthUserOutputDto> {
    return await this._createAuthUser.execute(input);
  }
  async find(
    input: FindAuthUserInputDto
  ): Promise<FindAuthUserOutputDto | undefined> {
    return await this._findAuthUser.execute(input);
  }
  async delete(
    input: DeleteAuthUserInputDto
  ): Promise<DeleteAuthUserOutputDto> {
    return await this._deleteAuthUser.execute(input);
  }
  async update(
    input: UpdateAuthUserInputDto
  ): Promise<UpdateAuthUserOutputDto> {
    return await this._updateAuthUser.execute(input);
  }
}
