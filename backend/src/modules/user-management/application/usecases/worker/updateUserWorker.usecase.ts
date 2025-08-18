import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserWorkerInputDto,
  UpdateUserWorkerOutputDto,
} from '../../dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/application/gateway/worker.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { WorkerMapper } from '@/modules/user-management/infrastructure/mapper/worker.mapper';

export default class UpdateUserWorker
  implements
    UseCaseInterface<UpdateUserWorkerInputDto, UpdateUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(
    userWorkerRepository: UserWorkerGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute(
    { id, name, address, email, birthday, salary }: UpdateUserWorkerInputDto,
    token: TokenData
  ): Promise<UpdateUserWorkerOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.WORKER,
      FunctionCalledEnum.UPDATE,
      token
    );

    const userAdm = await this._userWorkerRepository.find(token.masterId, id);
    if (!userAdm) throw new Error('User not found');

    name?.firstName !== undefined && (userAdm.name.firstName = name.firstName);
    name?.middleName !== undefined &&
      (userAdm.name.middleName = name.middleName);
    name?.lastName !== undefined && (userAdm.name.lastName = name.lastName);
    address?.street !== undefined && (userAdm.address.street = address.street);
    address?.city !== undefined && (userAdm.address.city = address.city);
    address?.zip !== undefined && (userAdm.address.zip = address.zip);
    address?.number !== undefined && (userAdm.address.number = address.number);
    address?.avenue !== undefined && (userAdm.address.avenue = address.avenue);
    address?.state !== undefined && (userAdm.address.state = address.state);
    email !== undefined && (userAdm.email = email);
    birthday !== undefined && (userAdm.birthday = new Date(birthday));
    salary?.currency !== undefined &&
      (userAdm.salary.currency = salary.currency);
    salary?.salary !== undefined && (userAdm.salary.salary = salary.salary);

    const result = await this._userWorkerRepository.update(
      token.masterId,
      userAdm
    );

    return WorkerMapper.toDTO(result);
  }
}
