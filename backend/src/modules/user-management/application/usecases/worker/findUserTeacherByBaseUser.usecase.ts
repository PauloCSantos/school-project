import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FindUserWorkerOutputDto } from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '../../gateway/worker.gateway';
import { WorkerMapper } from '@/modules/user-management/infrastructure/mapper/worker.mapper';

export default class FindUserWorkerByBaseUser
  implements
    UseCaseInterface<TokenData, Pick<FindUserWorkerOutputDto, 'id' | 'salary'> | null>
{
  constructor(private readonly userWorkerRepository: UserWorkerGateway) {}
  async execute({
    email,
    masterId,
  }: TokenData): Promise<Pick<FindUserWorkerOutputDto, 'id' | 'salary'> | null> {
    const response = await this.userWorkerRepository.findByBaseUserId(masterId, email);
    if (response) {
      const salary = response.salary.calculateTotalIncome();
      const { id } = WorkerMapper.toObj(response);
      return { id, salary };
    }
    return null;
  }
}
