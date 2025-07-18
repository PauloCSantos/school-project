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
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class CreateUserWorker
  implements
    UseCaseInterface<CreateUserWorkerInputDto, CreateUserWorkerOutputDto>
{
  private _userWorkerRepository: UserWorkerGateway;

  constructor(
    userWorkerRepository: UserWorkerGateway,
    readonly emailValidatorService: EmailAuthValidator
  ) {
    this._userWorkerRepository = userWorkerRepository;
  }
  async execute(
    { name, address, email, birthday, salary }: CreateUserWorkerInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<CreateUserWorkerOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.WORKER,
        FunctionCalledEnum.CREATE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    if (!(await this.emailValidatorService.validate(email))) {
      throw new Error('You must register this email before creating the user.');
    }
    const userWorker = new UserWorker({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday: new Date(birthday),
      salary: new Salary(salary),
    });

    const userVerification = await this._userWorkerRepository.findByEmail(
      userWorker.email
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userWorkerRepository.create(userWorker);

    return { id: result };
  }
}
