import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../dto/master-facade.dto';

export default interface MasterFacadeInterface {
  create(input: CreateUserMasterInputDto): Promise<CreateUserMasterOutputDto>;
  find(input: FindUserMasterInputDto): Promise<FindUserMasterOutputDto | null>;
  update(input: UpdateUserMasterInputDto): Promise<UpdateUserMasterOutputDto>;
}
