import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateUserAdministratorInputDto,
  CreateUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministratorGateway from '@/modules/user-management/application/gateway/administrator.gateway';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';

export default class CreateUserAdministrator
  implements
    UseCaseInterface<CreateUserAdministratorInputDto, CreateUserAdministratorOutputDto>
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(
    userAdministratorRepository: UserAdministratorGateway,
    private readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute(
    { name, address, birthday, graduation, salary }: CreateUserAdministratorInputDto,
    token: TokenData
  ): Promise<CreateUserAdministratorOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ADMINISTRATOR,
      FunctionCalledEnum.CREATE,
      token
    );

    if (!(await this.emailValidatorService.validate(token.email))) {
      throw new Error('You must register this email before creating the user.');
    }

    const baseUser = await this.userService.getOrCreateUser(token.email, {
      email: token.email,
      name: new Name(name),
      address: new Address(address),
      birthday,
    });

    const userAdministrator = new UserAdministrator({
      userId: baseUser.id.value,
      graduation,
      salary: new Salary(salary),
    });

    const userVerification = await this._userAdministratorRepository.findByBaseUserId(
      token.masterId,
      baseUser.id.value
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userAdministratorRepository.create(
      token.masterId,
      userAdministrator
    );

    return { id: result };
  }
}
