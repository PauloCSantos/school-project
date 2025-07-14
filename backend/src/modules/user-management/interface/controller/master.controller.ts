import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../application/dto/master-usecase.dto';
import CreateUserMaster from '../../application/usecases/master/createUserMaster.usecase';
import FindUserMaster from '../../application/usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '../../application/usecases/master/updateUserMaster.usecase';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

export class UserMasterController {
  constructor(
    private readonly createUserMaster: CreateUserMaster,
    private readonly findUserMaster: FindUserMaster,
    private readonly updateUserMaster: UpdateUserMaster,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  async create(
    input: CreateUserMasterInputDto,
    token: TokenData
  ): Promise<CreateUserMasterOutputDto> {
    const response = await this.createUserMaster.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async find(
    input: FindUserMasterInputDto,
    token: TokenData
  ): Promise<FindUserMasterOutputDto | null> {
    const response = await this.findUserMaster.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async update(
    input: UpdateUserMasterInputDto,
    token: TokenData
  ): Promise<UpdateUserMasterOutputDto> {
    const response = await this.updateUserMaster.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
