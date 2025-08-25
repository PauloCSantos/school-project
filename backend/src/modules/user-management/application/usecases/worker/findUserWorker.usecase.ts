import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserWorkerInputDto,
  FindUserWorkerOutputDto,
} from '../../../application/dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/application/gateway/worker.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { WorkerAssembler } from '../../assemblers/worker.assembler';

export default class FindUserWorker
  implements UseCaseInterface<FindUserWorkerInputDto, FindUserWorkerOutputDto | null>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(
    userWorkerRepository: UserWorkerGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
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
      const baseUser = await this.userService.findBaseUser(response.userId);
      return WorkerAssembler.toObj(baseUser!, response);
    }
    return null;
  }
}
