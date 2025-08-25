import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserWorkerInputDto,
  UpdateUserWorkerOutputDto,
} from '../../../application/dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/application/gateway/worker.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { WorkerAssembler } from '../../assemblers/worker.assembler';

export default class UpdateUserWorker
  implements UseCaseInterface<UpdateUserWorkerInputDto, UpdateUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(
    userWorkerRepository: UserWorkerGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
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
    const baseUser = await this.userService.findBaseUser(userAdm.userId);

    name?.firstName !== undefined && (baseUser!.name.firstName = name.firstName);
    name?.middleName !== undefined && (baseUser!.name.middleName = name.middleName);
    name?.lastName !== undefined && (baseUser!.name.lastName = name.lastName);
    address?.street !== undefined && (baseUser!.address.street = address.street);
    address?.city !== undefined && (baseUser!.address.city = address.city);
    address?.zip !== undefined && (baseUser!.address.zip = address.zip);
    address?.number !== undefined && (baseUser!.address.number = address.number);
    address?.avenue !== undefined && (baseUser!.address.avenue = address.avenue);
    address?.state !== undefined && (baseUser!.address.state = address.state);
    email !== undefined && (baseUser!.email = email);
    birthday !== undefined && (baseUser!.birthday = new Date(birthday));
    salary?.currency !== undefined && (userAdm.salary.currency = salary.currency);
    salary?.salary !== undefined && (userAdm.salary.salary = salary.salary);

    const baseUserUpdated = await this.userService.update(baseUser!);
    const result = await this._userWorkerRepository.update(token.masterId, userAdm);

    return WorkerAssembler.toObj(baseUserUpdated, result);
  }
}
