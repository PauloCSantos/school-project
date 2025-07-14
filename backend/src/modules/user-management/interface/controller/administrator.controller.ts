import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
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
import { TokenData } from '@/modules/@shared/type/sharedTypes';

export class UserAdministratorController {
  constructor(
    private readonly createUserAdministrator: CreateUserAdministrator,
    private readonly findUserAdministrator: FindUserAdministrator,
    private readonly findAllUserAdministrator: FindAllUserAdministrator,
    private readonly updateUserAdministrator: UpdateUserAdministrator,
    private readonly deleteUserAdministrator: DeleteUserAdministrator,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  async create(
    input: CreateUserAdministratorInputDto,
    token: TokenData
  ): Promise<CreateUserAdministratorOutputDto> {
    const response = await this.createUserAdministrator.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async find(
    input: FindUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindUserAdministratorOutputDto | null> {
    const response = await this.findUserAdministrator.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async findAll(
    input: FindAllUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindAllUserAdministratorOutputDto> {
    const response = await this.findAllUserAdministrator.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async delete(
    input: DeleteUserAdministratorInputDto,
    token: TokenData
  ): Promise<DeleteUserAdministratorOutputDto> {
    const response = await this.deleteUserAdministrator.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async update(
    input: UpdateUserAdministratorInputDto,
    token: TokenData
  ): Promise<UpdateUserAdministratorOutputDto> {
    const response = await this.updateUserAdministrator.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
