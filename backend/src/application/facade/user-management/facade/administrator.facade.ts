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
} from '@/application/dto/user-management/administrator-facade.dto';
import AdministratorFacadeInterface from '../interface/administrator-facade.interface';
import CreateUserAdministrator from '@/application/usecases/user-management/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/application/usecases/user-management/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/application/usecases/user-management/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/application/usecases/user-management/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/application/usecases/user-management/administrator/updateUserAdministrator.usecase';

type AdministratorFacadeProps = {
  createUserAdministrator: CreateUserAdministrator;
  deleteUserAdministrator: DeleteUserAdministrator;
  findAllUserAdministrator: FindAllUserAdministrator;
  findUserAdministrator: FindUserAdministrator;
  updateUserAdministrator: UpdateUserAdministrator;
};
export default class AdministratorFacade
  implements AdministratorFacadeInterface
{
  private _createUserAdministrator: CreateUserAdministrator;
  private _deleteUserAdministrator: DeleteUserAdministrator;
  private _findAllUserAdministrator: FindAllUserAdministrator;
  private _findUserAdministrator: FindUserAdministrator;
  private _updateUserAdministrator: UpdateUserAdministrator;

  constructor(input: AdministratorFacadeProps) {
    this._createUserAdministrator = input.createUserAdministrator;
    this._deleteUserAdministrator = input.deleteUserAdministrator;
    this._findAllUserAdministrator = input.findAllUserAdministrator;
    this._findUserAdministrator = input.findUserAdministrator;
    this._updateUserAdministrator = input.updateUserAdministrator;
  }

  async create(
    input: CreateUserAdministratorInputDto
  ): Promise<CreateUserAdministratorOutputDto> {
    return await this._createUserAdministrator.execute(input);
  }
  async find(
    input: FindUserAdministratorInputDto
  ): Promise<FindUserAdministratorOutputDto | undefined> {
    return await this._findUserAdministrator.execute(input);
  }
  async findAll(
    input: FindAllUserAdministratorInputDto
  ): Promise<FindAllUserAdministratorOutputDto> {
    return await this._findAllUserAdministrator.execute(input);
  }
  async delete(
    input: DeleteUserAdministratorInputDto
  ): Promise<DeleteUserAdministratorOutputDto> {
    return await this._deleteUserAdministrator.execute(input);
  }
  async update(
    input: UpdateUserAdministratorInputDto
  ): Promise<UpdateUserAdministratorOutputDto> {
    return await this._updateUserAdministrator.execute(input);
  }
}
