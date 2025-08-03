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
    token?: TokenData
  ): Promise<FindAllUserAdministratorOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ADMINISTRATOR,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._userAdministratorRepository.findAll(
      offset,
      quantity
    );

    const result = results.map(userAdministrator => ({
      id: userAdministrator.id.value,
      name: {
        fullName: userAdministrator.name.fullName(),
        shortName: userAdministrator.name.shortName(),
      },
      address: {
        street: userAdministrator.address.street,
        city: userAdministrator.address.city,
        zip: userAdministrator.address.zip,
        number: userAdministrator.address.number,
        avenue: userAdministrator.address.avenue,
        state: userAdministrator.address.state,
      },
      email: userAdministrator.email,
      birthday: userAdministrator.birthday,
      salary: userAdministrator.salary.calculateTotalIncome(),
      graduation: userAdministrator.graduation,
    }));

    return result;
  }
}
