import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserAdministratorInputDto,
  UpdateUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '@/modules/user-management/application/gateway/administrator.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { AdministratorAssembler } from '../../assemblers/administrator.assembler';

export default class UpdateUserAdministrator
  implements
    UseCaseInterface<UpdateUserAdministratorInputDto, UpdateUserAdministratorOutputDto>
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(
    userAdministratorRepository: UserAdministratorGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute(
    {
      id,
      name,
      address,
      email,
      birthday,
      graduation,
      salary,
    }: UpdateUserAdministratorInputDto,
    token: TokenData
  ): Promise<UpdateUserAdministratorOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ADMINISTRATOR,
      FunctionCalledEnum.UPDATE,
      token
    );

    const userAdm = await this._userAdministratorRepository.find(token.masterId, id);
    if (!userAdm) throw new Error('User not found');
    const baseUser = await this.userService.findBaseUser(userAdm.userId);

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
    graduation !== undefined && (userAdm.graduation = graduation);
    salary?.currency !== undefined && (userAdm.salary.currency = salary.currency);
    salary?.salary !== undefined && (userAdm.salary.salary = salary.salary);

    const baseUserUpdated = await this.userService.update(baseUser!);
    const administratorUpdated = await this._userAdministratorRepository.update(
      token.masterId,
      userAdm
    );

    return AdministratorAssembler.toObj(baseUserUpdated, administratorUpdated);
  }
}
