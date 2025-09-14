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
  constructor(
    private readonly userWorkerRepository: UserWorkerGateway,
    private readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {}
  async execute(
    input: CreateUserWorkerInputDto,
    token: TokenData
  ): Promise<CreateUserWorkerOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.WORKER,
      FunctionCalledEnum.CREATE,
      token
    );

    const { email, salary, creationMode } = input;
    let baseUser;

    if (!(await this.emailValidatorService.validate(email))) {
      throw new ConflictError('You must register this email before creating the user.');
    }

    if (creationMode === 'partial') {
      baseUser = await this.userService.getOrCreateUser(email, 'partial');
    } else {
      const { name, address, birthday } = input;
      baseUser = await this.userService.getOrCreateUser(email, 'full', {
        email,
        name: new Name(name),
        address: new Address(address),
        birthday: new Date(birthday),
      });
    }

    const userWorker = new UserWorker({
      userId: baseUser.id.value,
      salary: new Salary(salary),
    });

    const userVerification = await this.userWorkerRepository.findByBaseUserId(
      token.masterId,
      baseUser.id.value
    );
    if (userVerification) throw new ConflictError('User already exists');

    const result = await this.userWorkerRepository.create(token.masterId, userWorker);

    return { id: result };
  }
}
