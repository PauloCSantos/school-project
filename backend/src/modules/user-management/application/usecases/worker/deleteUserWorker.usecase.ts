import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserWorkerInputDto,
  DeleteUserWorkerOutputDto,
} from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/infrastructure/gateway/user-worker.gateway';

export default class DeleteUserWorker
  implements
    UseCaseInterface<DeleteUserWorkerInputDto, DeleteUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(userWorkerRepository: UserWorkerGateway) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute({
    id,
  }: DeleteUserWorkerInputDto): Promise<DeleteUserWorkerOutputDto> {
    const userVerification = await this._userWorkerRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userWorkerRepository.delete(id);

    return { message: result };
  }
}
