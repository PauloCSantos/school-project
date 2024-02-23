import {
  FindUserWorkerInputDto,
  FindUserWorkerOutputDto,
} from '@/application/dto/user-management/worker-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserWorkerGateway from '@/infraestructure/gateway/user-management-repository/user-worker.gateway';

export default class FindUserWorker
  implements
    UseCaseInterface<
      FindUserWorkerInputDto,
      FindUserWorkerOutputDto | undefined
    >
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(userWorkerRepository: UserWorkerGateway) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute({
    id,
  }: FindUserWorkerInputDto): Promise<FindUserWorkerOutputDto | undefined> {
    const response = await this._userWorkerRepository.find(id);
    if (response) {
      return {
        id: response.id.id,
        name: {
          fullName: response.name.fullName(),
          shortName: response.name.shortName(),
        },
        address: {
          street: response.address.street,
          city: response.address.city,
          zip: response.address.zip,
          number: response.address.number,
          avenue: response.address.avenue,
          state: response.address.state,
        },
        email: response.email,
        birthday: response.birthday,
        salary: response.salary.calculateTotalIncome(),
      };
    } else {
      return response;
    }
  }
}
