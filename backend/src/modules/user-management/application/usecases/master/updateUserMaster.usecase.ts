import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../../application/dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { MasterAssembler } from '../../assemblers/master.assembler';
import { UserNotFoundError } from '../../errors/user-not-found.error';

export default class UpdateUserMaster
  implements UseCaseInterface<UpdateUserMasterInputDto, UpdateUserMasterOutputDto>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(
    userMasterRepository: UserMasterGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
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

    const userMaster = await this._userMasterRepository.find(token.masterId, id);
    if (!userMaster) throw new UserNotFoundError(RoleUsersEnum.MASTER, id);
    const baseUser = await this.userService.findBaseUser(userMaster.userId);
    name?.firstName !== undefined && (baseUser!.name.firstName = name.firstName);
    name?.middleName !== undefined && (baseUser!.name.middleName = name.middleName);
    name?.lastName !== undefined && (baseUser!.name.lastName = name.lastName);
    address?.street !== undefined && (baseUser!.address.street = address.street);
    address?.city !== undefined && (baseUser!.address.city = address.city);
    address?.zip !== undefined && (baseUser!.address.zip = address.zip);
    address?.number !== undefined && (baseUser!.address.number = address.number);
    address?.avenue !== undefined && (baseUser!.address.avenue = address.avenue);
    address?.state !== undefined && (baseUser!.address.state = address.state);
    email !== undefined && (baseUser!.email = email);
    birthday !== undefined && (baseUser!.birthday = new Date(birthday));
    cnpj !== undefined && (userMaster.cnpj = cnpj);

    const baseUserUpdated = await this.userService.update(baseUser!);
    const result = await this._userMasterRepository.update(token.masterId, userMaster);

    return MasterAssembler.toObj(baseUserUpdated, result);
  }
}
