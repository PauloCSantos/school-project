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
