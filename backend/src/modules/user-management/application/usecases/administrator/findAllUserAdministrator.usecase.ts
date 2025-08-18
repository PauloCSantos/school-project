import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserAdministratorInputDto,
  FindAllUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '@/modules/user-management/application/gateway/administrator.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { AdministratorMapper } from '@/modules/user-management/infrastructure/mapper/administrator.mapper';

export default class FindAllUserAdministrator
  implements
    UseCaseInterface<
      FindAllUserAdministratorInputDto,
      FindAllUserAdministratorOutputDto
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
    { offset, quantity }: FindAllUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindAllUserAdministratorOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ADMINISTRATOR,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._userAdministratorRepository.findAll(
      token.masterId,
      offset,
      quantity
    );

    return AdministratorMapper.toDTOList(results);
  }
}
