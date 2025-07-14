import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserWorkerInputDto,
  DeleteUserWorkerOutputDto,
} from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/infrastructure/gateway/worker.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class DeleteUserWorker
  implements
    UseCaseInterface<DeleteUserWorkerInputDto, DeleteUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(userWorkerRepository: UserWorkerGateway) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute(
    { id }: DeleteUserWorkerInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteUserWorkerOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.WORKER,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const userVerification = await this._userWorkerRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userWorkerRepository.delete(id);

    return { message: result };
  }
}
