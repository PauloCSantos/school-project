import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserAdministratorInputDto,
  FindUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '@/modules/user-management/application/gateway/administrator.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { AdministratorMapper } from '@/modules/user-management/infrastructure/mapper/administrator.mapper';

export default class FindUserAdministrator
  implements
    UseCaseInterface<
      FindUserAdministratorInputDto,
      FindUserAdministratorOutputDto | null
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
    { id }: FindUserAdministratorInputDto,
    token: TokenData
  ): Promise<FindUserAdministratorOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ADMINISTRATOR,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userAdministratorRepository.find(
      token.masterId,
      id
    );
    if (response) {
      return AdministratorMapper.toDTO(response);
    }
    return null;
  }
}
