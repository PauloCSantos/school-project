import { TokenData } from '@/modules/@shared/type/sharedTypes';
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
} from '../../../application/dto/administrator-facade.dto';

export default interface AdministratorFacadeInterface {
  create(
    input: CreateUserAdministratorInputDto,
    token: TokenData
  ): Promise<CreateUserAdministratorOutputDto>;
  find(
    input: FindUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindUserAdministratorOutputDto | null>;
  findAll(
    input: FindAllUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindAllUserAdministratorOutputDto>;
  delete(
    input: DeleteUserAdministratorInputDto,
    token: TokenData
  ): Promise<DeleteUserAdministratorOutputDto>;
  update(
    input: UpdateUserAdministratorInputDto,
    token: TokenData
  ): Promise<UpdateUserAdministratorOutputDto>;
}
