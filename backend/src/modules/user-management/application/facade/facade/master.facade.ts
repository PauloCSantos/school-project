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
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type MasterFacadeProps = {
  readonly createUserMaster: CreateUserMaster;
  readonly findUserMaster: FindUserMaster;
  readonly updateUserMaster: UpdateUserMaster;
  readonly policiesService: PoliciesServiceInterface;
};
export default class MasterFacade implements MasterFacadeInterface {
  private readonly _createUserMaster: CreateUserMaster;
  private readonly _findUserMaster: FindUserMaster;
  private readonly _updateUserMaster: UpdateUserMaster;
  private readonly _policiesService: PoliciesServiceInterface;

  constructor(input: MasterFacadeProps) {
    this._createUserMaster = input.createUserMaster;
    this._findUserMaster = input.findUserMaster;
    this._updateUserMaster = input.updateUserMaster;
    this._policiesService = input.policiesService;
  }

  async create(
    input: CreateUserMasterInputDto,
    token: TokenData
  ): Promise<CreateUserMasterOutputDto> {
    return await this._createUserMaster.execute(
      input,
      this._policiesService,
      token
    );
  }
  async find(
    input: FindUserMasterInputDto,
    token: TokenData
  ): Promise<FindUserMasterOutputDto | null> {
    return await this._findUserMaster.execute(
      input,
      this._policiesService,
      token
    );
  }
  async update(
    input: UpdateUserMasterInputDto,
    token: TokenData
  ): Promise<UpdateUserMasterOutputDto> {
    return await this._updateUserMaster.execute(
      input,
      this._policiesService,
      token
    );
  }
}
