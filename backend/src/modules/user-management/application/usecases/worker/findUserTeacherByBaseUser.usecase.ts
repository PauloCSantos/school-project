import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FindUserWorkerOutputDto } from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '../../gateway/worker.gateway';
import { WorkerMapper } from '@/modules/user-management/infrastructure/mapper/worker.mapper';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';

export default class FindUserWorkerByBaseUser
  implements
    UseCaseInterface<TokenData, Pick<FindUserWorkerOutputDto, 'id' | 'salary'> | null>
{
  constructor(
    private readonly userWorkerRepository: UserWorkerGateway,
    private readonly userService: UserServiceInterface
  ) {}
  async execute({
    email,
    masterId,
  }: TokenData): Promise<Pick<FindUserWorkerOutputDto, 'id' | 'salary'> | null> {
    const userBase = await this.userService.findBaseUserByEmail(email);
    const response = await this.userWorkerRepository.findByBaseUserId(
      masterId,
      userBase.id.value
    );
    if (response) {
      const salary = response.salary.calculateTotalIncome();
      const { id } = WorkerMapper.toObj(response);
      return { id, salary };
    }
    return null;
  }
}
