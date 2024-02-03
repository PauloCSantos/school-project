import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '@/application/dto/user-management/master-usecase.dto';
import CreateUserMaster from '@/application/usecases/user-management/master/createUserMaster.usecase';
import FindUserMaster from '@/application/usecases/user-management/master/findUserMaster.usecase';
import UpdateUserMaster from '@/application/usecases/user-management/master/updateUserMaster.usecase';

export class UserMasterController {
  constructor(
    private readonly createUserMaster: CreateUserMaster,
    private readonly findUserMaster: FindUserMaster,
    private readonly updateUserMaster: UpdateUserMaster
  ) {}

  async create(
    input: CreateUserMasterInputDto
  ): Promise<CreateUserMasterOutputDto> {
    const response = await this.createUserMaster.execute(input);
    return response;
  }
  async find(
    input: FindUserMasterInputDto
  ): Promise<FindUserMasterOutputDto | undefined> {
    const response = await this.findUserMaster.execute(input);
    return response;
  }
  async update(
    input: UpdateUserMasterInputDto
  ): Promise<UpdateUserMasterOutputDto> {
    const response = await this.updateUserMaster.execute(input);
    return response;
  }
}
