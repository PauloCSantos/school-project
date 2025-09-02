import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';
import {
  CreateUserWorkerInputDto,
  CreateUserWorkerOutputDto,
} from '../../../application/dto/worker-usecase.dto';
import UserWorkerGateway from '@/modules/user-management/application/gateway/worker.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { ConflictError } from '@/modules/@shared/application/errors/conflict.error';

export default class CreateUserWorker
  implements UseCaseInterface<CreateUserWorkerInputDto, CreateUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(
    userWorkerRepository: UserWorkerGateway,
    readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute(
    { name, address, email, birthday, salary }: CreateUserWorkerInputDto,
    token: TokenData
  ): Promise<CreateUserWorkerOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.WORKER,
      FunctionCalledEnum.CREATE,
      token
    );

    if (!(await this.emailValidatorService.validate(email))) {
      throw new ConflictError('You must register this email before creating the user.');
    }

    const baseUser = await this.userService.getOrCreateUser(email, {
      email: email,
      name: new Name(name),
      address: new Address(address),
      birthday: new Date(birthday),
    });

    const userWorker = new UserWorker({
      userId: baseUser.id.value,
      salary: new Salary(salary),
    });

    const userVerification = await this._userWorkerRepository.findByBaseUserId(
      token.masterId,
      baseUser.id.value
    );
    if (userVerification) throw new ConflictError('User already exists');

    const result = await this._userWorkerRepository.create(token.masterId, userWorker);

    return { id: result };
  }
}
