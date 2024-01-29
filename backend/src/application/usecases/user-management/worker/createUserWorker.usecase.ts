import {
  CreateUserWorkerInputDto,
  CreateUserWorkerOutputDto,
} from '@/application/dto/user-management/worker-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserWorkerGateway from '@/infraestructure/gateway/user-management-repository/user-worker.gateway';
import UserWorker from '@/modules/user-management/domain/entity/user-worker.entity';

export default class CreateUserWorker
  implements
    UseCaseInterface<CreateUserWorkerInputDto, CreateUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(userWorkerRepository: UserWorkerGateway) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute({
    name,
    address,
    email,
    birthday,
    salary,
  }: CreateUserWorkerInputDto): Promise<CreateUserWorkerOutputDto> {
    const userWorker = new UserWorker({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday,
      salary: new Salary(salary),
    });

    const userVerification = await this._userWorkerRepository.find(
      userWorker.id.id
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userWorkerRepository.create(userWorker);

    return { id: result };
  }
}
