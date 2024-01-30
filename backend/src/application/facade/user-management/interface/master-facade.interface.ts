import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '@/application/dto/user-management/master-facade.dto';

export default interface MasterFacadeInterface {
  create(input: CreateUserMasterInputDto): Promise<CreateUserMasterOutputDto>;
  find(
    input: FindUserMasterInputDto
  ): Promise<FindUserMasterOutputDto | undefined>;
  update(input: UpdateUserMasterInputDto): Promise<UpdateUserMasterOutputDto>;
}
