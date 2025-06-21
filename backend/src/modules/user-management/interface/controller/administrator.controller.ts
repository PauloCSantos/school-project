import {
  CreateUserAdministratorInputDto,
  CreateUserAdministratorOutputDto,
  FindAllUserAdministratorInputDto,
  FindAllUserAdministratorOutputDto,
  FindUserAdministratorInputDto,
  FindUserAdministratorOutputDto,
  DeleteUserAdministratorInputDto,
  DeleteUserAdministratorOutputDto,
  UpdateUserAdministratorInputDto,
  UpdateUserAdministratorOutputDto,
} from '../../application/dto/administrator-usecase.dto';
import CreateUserAdministrator from '../../application/usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '../../application/usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '../../application/usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '../../application/usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '../../application/usecases/administrator/updateUserAdministrator.usecase';

export class UserAdministratorController {
  constructor(
    private readonly createUserAdministrator: CreateUserAdministrator,
    private readonly findUserAdministrator: FindUserAdministrator,
    private readonly findAllUserAdministrator: FindAllUserAdministrator,
    private readonly updateUserAdministrator: UpdateUserAdministrator,
    private readonly deleteUserAdministrator: DeleteUserAdministrator
  ) {}

  async create(
    input: CreateUserAdministratorInputDto
  ): Promise<CreateUserAdministratorOutputDto> {
    const response = await this.createUserAdministrator.execute(input);
    return response;
  }
  async find(
    input: FindUserAdministratorInputDto
  ): Promise<FindUserAdministratorOutputDto | null> {
    const response = await this.findUserAdministrator.execute(input);
    return response;
  }
  async findAll(
    input: FindAllUserAdministratorInputDto
  ): Promise<FindAllUserAdministratorOutputDto> {
    const response = await this.findAllUserAdministrator.execute(input);
    return response;
  }
  async delete(
    input: DeleteUserAdministratorInputDto
  ): Promise<DeleteUserAdministratorOutputDto> {
    const response = await this.deleteUserAdministrator.execute(input);
    return response;
  }
  async update(
    input: UpdateUserAdministratorInputDto
  ): Promise<UpdateUserAdministratorOutputDto> {
    const response = await this.updateUserAdministrator.execute(input);
    return response;
  }
}
