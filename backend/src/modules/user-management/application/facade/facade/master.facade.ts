import CreateUserMaster from '../../usecases/master/createUserMaster.usecase';
import FindUserMaster from '../../usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '../../usecases/master/updateUserMaster.usecase';
import MasterFacadeInterface from '../interface/master-facade.interface';
import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../dto/master-facade.dto';

type MasterFacadeProps = {
  createUserMaster: CreateUserMaster;
  findUserMaster: FindUserMaster;
  updateUserMaster: UpdateUserMaster;
};
export default class MasterFacade implements MasterFacadeInterface {
  private _createUserMaster: CreateUserMaster;
  private _findUserMaster: FindUserMaster;
  private _updateUserMaster: UpdateUserMaster;

  constructor(input: MasterFacadeProps) {
    this._createUserMaster = input.createUserMaster;
    this._findUserMaster = input.findUserMaster;
    this._updateUserMaster = input.updateUserMaster;
  }

  async create(
    input: CreateUserMasterInputDto
  ): Promise<CreateUserMasterOutputDto> {
    return await this._createUserMaster.execute(input);
  }
  async find(
    input: FindUserMasterInputDto
  ): Promise<FindUserMasterOutputDto | null> {
    return await this._findUserMaster.execute(input);
  }
  async update(
    input: UpdateUserMasterInputDto
  ): Promise<UpdateUserMasterOutputDto> {
    return await this._updateUserMaster.execute(input);
  }
}
