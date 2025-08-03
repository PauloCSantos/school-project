import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserWorkerInputDto,
  FindUserWorkerOutputDto,
} from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/application/gateway/worker.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class FindUserWorker
  implements
    UseCaseInterface<FindUserWorkerInputDto, FindUserWorkerOutputDto | null>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(
    userWorkerRepository: UserWorkerGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute(
    { id }: FindUserWorkerInputDto,
    token?: TokenData
  ): Promise<FindUserWorkerOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.WORKER,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userWorkerRepository.find(id);
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
      };
    } else {
      return response;
    }
  }
}
