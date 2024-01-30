import {
  CreateUserAdministratorInputDto,
  CreateUserAdministratorOutputDto,
  DeleteUserAdministratorInputDto,
  DeleteUserAdministratorOutputDto,
  FindAllUserAdministratorInputDto,
  FindAllUserAdministratorOutputDto,
  FindUserAdministratorInputDto,
  FindUserAdministratorOutputDto,
  UpdateUserAdministratorInputDto,
  UpdateUserAdministratorOutputDto,
} from '@/application/dto/user-management/administrator-facade.dto';

export default interface AdministratorFacadeInterface {
  create(
    input: CreateUserAdministratorInputDto
  ): Promise<CreateUserAdministratorOutputDto>;
  find(
    input: FindUserAdministratorInputDto
  ): Promise<FindUserAdministratorOutputDto | undefined>;
  findAll(
    input: FindAllUserAdministratorInputDto
  ): Promise<FindAllUserAdministratorOutputDto>;
  delete(
    input: DeleteUserAdministratorInputDto
  ): Promise<DeleteUserAdministratorOutputDto>;
  update(
    input: UpdateUserAdministratorInputDto
  ): Promise<UpdateUserAdministratorOutputDto>;
}
