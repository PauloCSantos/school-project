import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserWorkerInputDto,
  FindAllUserWorkerOutputDto,
} from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/infrastructure/gateway/worker.gateway';

export default class FindAllUserWorker
  implements
    UseCaseInterface<FindAllUserWorkerInputDto, FindAllUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(userWorkerRepository: UserWorkerGateway) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllUserWorkerInputDto): Promise<FindAllUserWorkerOutputDto> {
    const results = await this._userWorkerRepository.findAll(offset, quantity);

    const result = results.map(userWorker => ({
      id: userWorker.id.value,
      name: {
        fullName: userWorker.name.fullName(),
        shortName: userWorker.name.shortName(),
      },
      address: {
        street: userWorker.address.street,
        city: userWorker.address.city,
        zip: userWorker.address.zip,
        number: userWorker.address.number,
        avenue: userWorker.address.avenue,
        state: userWorker.address.state,
      },
      email: userWorker.email,
      birthday: userWorker.birthday,
      salary: userWorker.salary.calculateTotalIncome(),
    }));

    return result;
  }
}
