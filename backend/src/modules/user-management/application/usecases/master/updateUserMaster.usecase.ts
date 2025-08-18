import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { MasterMapper } from '@/modules/user-management/infrastructure/mapper/master.mapper';

export default class UpdateUserMaster
  implements
    UseCaseInterface<UpdateUserMasterInputDto, UpdateUserMasterOutputDto>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(
    userMasterRepository: UserMasterGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute(
    { id, name, address, email, birthday, cnpj }: UpdateUserMasterInputDto,
    token: TokenData
  ): Promise<UpdateUserMasterOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.MASTER,
      FunctionCalledEnum.UPDATE,
      token
    );

    const userMaster = await this._userMasterRepository.find(
      token.masterId,
      id
    );
    if (!userMaster) throw new Error('User not found');

    name?.firstName !== undefined &&
      (userMaster.name.firstName = name.firstName);
    name?.middleName !== undefined &&
      (userMaster.name.middleName = name.middleName);
    name?.lastName !== undefined && (userMaster.name.lastName = name.lastName);
    address?.street !== undefined &&
      (userMaster.address.street = address.street);
    address?.city !== undefined && (userMaster.address.city = address.city);
    address?.zip !== undefined && (userMaster.address.zip = address.zip);
    address?.number !== undefined &&
      (userMaster.address.number = address.number);
    address?.avenue !== undefined &&
      (userMaster.address.avenue = address.avenue);
    address?.state !== undefined && (userMaster.address.state = address.state);
    email !== undefined && (userMaster.email = email);
    birthday !== undefined && (userMaster.birthday = new Date(birthday));
    cnpj !== undefined && (userMaster.cnpj = cnpj);

    const result = await this._userMasterRepository.update(
      token.masterId,
      userMaster
    );

    return MasterMapper.toObj(result);
  }
}
