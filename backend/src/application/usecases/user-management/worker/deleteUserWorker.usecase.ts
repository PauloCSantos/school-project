import {
  DeleteUserWorkerInputDto,
  DeleteUserWorkerOutputDto,
} from '@/application/dto/user-management/worker-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserWorkerGateway from '@/modules/user-management/worker/gateway/user-worker.gateway';

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
