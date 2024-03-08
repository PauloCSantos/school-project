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

export default interface AuthUserFacadeInterface {
  create(input: CreateAuthUserInputDto): Promise<CreateAuthUserOutputDto>;
  find(input: FindAuthUserInputDto): Promise<FindAuthUserOutputDto | undefined>;
  delete(input: DeleteAuthUserInputDto): Promise<DeleteAuthUserOutputDto>;
  update(input: UpdateAuthUserInputDto): Promise<UpdateAuthUserOutputDto>;
}
