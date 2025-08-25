import {
  CreateUserAdministratorInputDto,
  CreateUserAdministratorOutputDto,
  FindUserAdministratorInputDto,
  FindUserAdministratorOutputDto,
  FindAllUserAdministratorInputDto,
  FindAllUserAdministratorOutputDto,
  DeleteUserAdministratorInputDto,
  DeleteUserAdministratorOutputDto,
  UpdateUserAdministratorInputDto,
  UpdateUserAdministratorOutputDto,
} from '../../../application/dto/administrator-facade.dto';
import AdministratorFacadeInterface from '../interface/administrator-facade.interface';
import CreateUserAdministrator from '../../usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '../../usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '../../usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '../../usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '../../usecases/administrator/updateUserAdministrator.usecase';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type AdministratorFacadeProps = {
  readonly createUserAdministrator: CreateUserAdministrator;
  readonly deleteUserAdministrator: DeleteUserAdministrator;
  readonly findAllUserAdministrator: FindAllUserAdministrator;
  readonly findUserAdministrator: FindUserAdministrator;
  readonly updateUserAdministrator: UpdateUserAdministrator;
};
export default class AdministratorFacade implements AdministratorFacadeInterface {
  private readonly _createUserAdministrator: CreateUserAdministrator;
  private readonly _deleteUserAdministrator: DeleteUserAdministrator;
  private readonly _findAllUserAdministrator: FindAllUserAdministrator;
  private readonly _findUserAdministrator: FindUserAdministrator;
  private readonly _updateUserAdministrator: UpdateUserAdministrator;

  constructor(input: AdministratorFacadeProps) {
    this._createUserAdministrator = input.createUserAdministrator;
    this._deleteUserAdministrator = input.deleteUserAdministrator;
    this._findAllUserAdministrator = input.findAllUserAdministrator;
    this._findUserAdministrator = input.findUserAdministrator;
    this._updateUserAdministrator = input.updateUserAdministrator;
  }

  async create(
    input: CreateUserAdministratorInputDto,
    token: TokenData
  ): Promise<CreateUserAdministratorOutputDto> {
    return await this._createUserAdministrator.execute(input, token);
  }
  async find(
    input: FindUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindUserAdministratorOutputDto | null> {
    return await this._findUserAdministrator.execute(input, token);
  }
  async findAll(
    input: FindAllUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindAllUserAdministratorOutputDto> {
    return await this._findAllUserAdministrator.execute(input, token);
  }
  async delete(
    input: DeleteUserAdministratorInputDto,
    token: TokenData
  ): Promise<DeleteUserAdministratorOutputDto> {
    return await this._deleteUserAdministrator.execute(input, token);
  }
  async update(
    input: UpdateUserAdministratorInputDto,
    token: TokenData
  ): Promise<UpdateUserAdministratorOutputDto> {
    return await this._updateUserAdministrator.execute(input, token);
  }
}
