import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../../application/dto/master-facade.dto';

export default interface MasterFacadeInterface {
  create(
    input: CreateUserMasterInputDto,
    token: TokenData
  ): Promise<CreateUserMasterOutputDto>;
  find(
    input: FindUserMasterInputDto,
    token: TokenData
  ): Promise<FindUserMasterOutputDto | null>;
  update(
    input: UpdateUserMasterInputDto,
    token: TokenData
  ): Promise<UpdateUserMasterOutputDto>;
  checkUserMasterFromToken(token: TokenData): Promise<boolean>;
}
