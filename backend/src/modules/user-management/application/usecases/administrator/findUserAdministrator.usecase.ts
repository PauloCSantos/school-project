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
    token?: TokenData
  ): Promise<FindUserAdministratorOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ADMINISTRATOR,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userAdministratorRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        name: {
          fullName: response.name.fullName(),
          shortName: response.name.shortName(),
        },
        address: {
          street: response.address.street,
          city: response.address.city,
          zip: response.address.zip,
          number: response.address.number,
          avenue: response.address.avenue,
          state: response.address.state,
        },
        email: response.email,
        birthday: response.birthday,
        salary: response.salary.calculateTotalIncome(),
        graduation: response.graduation,
      };
    } else {
      return response;
    }
  }
}
