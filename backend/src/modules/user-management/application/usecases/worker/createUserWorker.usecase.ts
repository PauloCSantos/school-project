import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';
import {
  CreateUserWorkerInputDto,
  CreateUserWorkerOutputDto,
} from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/infrastructure/gateway/worker.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';

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
      birthday: new Date(birthday),
      salary: new Salary(salary),
    });

    const userVerification = await this._userWorkerRepository.find(
      userWorker.id.value
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userWorkerRepository.create(userWorker);

    return { id: result };
  }
}
