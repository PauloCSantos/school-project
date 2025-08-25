import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserWorkerInputDto,
  FindAllUserWorkerOutputDto,
} from '../../../application/dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/application/gateway/worker.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { WorkerAssembler } from '../../assemblers/worker.assembler';

export default class FindAllUserWorker
  implements UseCaseInterface<FindAllUserWorkerInputDto, FindAllUserWorkerOutputDto>
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
    { offset, quantity }: FindAllUserWorkerInputDto,
    token: TokenData
  ): Promise<FindAllUserWorkerOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.WORKER,
      FunctionCalledEnum.FIND_ALL,
      token
    );
    const workers = await this._userWorkerRepository.findAll(
      token.masterId,
      quantity,
      offset
    );

    const results = await this.userService.findBaseUsers(workers);

    return WorkerAssembler.toObjList(results);
  }
}
