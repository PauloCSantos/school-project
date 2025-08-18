import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserAdministratorInputDto,
  UpdateUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '@/modules/user-management/application/gateway/administrator.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { AdministratorMapper } from '@/modules/user-management/infrastructure/mapper/administrator.mapper';

export default class UpdateUserAdministrator
  implements
    UseCaseInterface<
      UpdateUserAdministratorInputDto,
      UpdateUserAdministratorOutputDto
    >
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(
    userAdministratorRepository: UserAdministratorGateway,
    private readonly policiesService: PoliciesServiceInterface
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

    const userAdm = await this._userAdministratorRepository.find(
      token.masterId,
      id
    );
    if (!userAdm) throw new Error('User not found');

    name?.firstName !== undefined && (userAdm.name.firstName = name.firstName);
    name?.middleName !== undefined &&
      (userAdm.name.middleName = name.middleName);
    name?.lastName !== undefined && (userAdm.name.lastName = name.lastName);
    address?.street !== undefined && (userAdm.address.street = address.street);
    address?.city !== undefined && (userAdm.address.city = address.city);
    address?.zip !== undefined && (userAdm.address.zip = address.zip);
    address?.number !== undefined && (userAdm.address.number = address.number);
    address?.avenue !== undefined && (userAdm.address.avenue = address.avenue);
    address?.state !== undefined && (userAdm.address.state = address.state);
    email !== undefined && (userAdm.email = email);
    birthday !== undefined && (userAdm.birthday = new Date(birthday));
    graduation !== undefined && (userAdm.graduation = graduation);
    salary?.currency !== undefined &&
      (userAdm.salary.currency = salary.currency);
    salary?.salary !== undefined && (userAdm.salary.salary = salary.salary);

    const result = await this._userAdministratorRepository.update(
      token.masterId,
      userAdm
    );

    return AdministratorMapper.toDTO(result);
  }
}
