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
import { WorkerMapper } from '@/modules/user-management/infrastructure/mapper/worker.mapper';

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
    token: TokenData
  ): Promise<FindUserWorkerOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.WORKER,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userWorkerRepository.find(token.masterId, id);
    if (response) {
      return WorkerMapper.toDTO(response);
    }
    return null;
  }
}
