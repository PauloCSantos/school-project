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
} from '../../../application/dto/master-facade.dto';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type MasterFacadeProps = {
  readonly createUserMaster: CreateUserMaster;
  readonly findUserMaster: FindUserMaster;
  readonly updateUserMaster: UpdateUserMaster;
};
export default class MasterFacade implements MasterFacadeInterface {
  private readonly _createUserMaster: CreateUserMaster;
  private readonly _findUserMaster: FindUserMaster;
  private readonly _updateUserMaster: UpdateUserMaster;

  constructor(input: MasterFacadeProps) {
    this._createUserMaster = input.createUserMaster;
    this._findUserMaster = input.findUserMaster;
    this._updateUserMaster = input.updateUserMaster;
  }

  async create(
    input: CreateUserMasterInputDto,
    token: TokenData
  ): Promise<CreateUserMasterOutputDto> {
    return await this._createUserMaster.execute(input, token);
  }
  async find(
    input: FindUserMasterInputDto,
    token: TokenData
  ): Promise<FindUserMasterOutputDto | null> {
    return await this._findUserMaster.execute(input, token);
  }
  async update(
    input: UpdateUserMasterInputDto,
    token: TokenData
  ): Promise<UpdateUserMasterOutputDto> {
    return await this._updateUserMaster.execute(input, token);
  }
}
