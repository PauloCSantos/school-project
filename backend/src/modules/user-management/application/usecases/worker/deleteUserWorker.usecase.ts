import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserWorkerInputDto,
  DeleteUserWorkerOutputDto,
} from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/application/gateway/worker.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class DeleteUserWorker
  implements
    UseCaseInterface<DeleteUserWorkerInputDto, DeleteUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(
    userWorkerRepository: UserWorkerGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute(
    { id }: DeleteUserWorkerInputDto,
    token?: TokenData
  ): Promise<DeleteUserWorkerOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.WORKER,
      FunctionCalledEnum.DELETE,
      token
    );

    const userVerification = await this._userWorkerRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userWorkerRepository.delete(id);

    return { message: result };
  }
}
