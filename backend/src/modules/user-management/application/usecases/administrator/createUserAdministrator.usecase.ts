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
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class CreateUserAdministrator
  implements
    UseCaseInterface<
      CreateUserAdministratorInputDto,
      CreateUserAdministratorOutputDto
    >
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(
    userAdministratorRepository: UserAdministratorGateway,
    readonly emailValidatorService: EmailAuthValidator
  ) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute(
    {
      name,
      address,
      email,
      birthday,
      graduation,
      salary,
    }: CreateUserAdministratorInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<CreateUserAdministratorOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.ADMINISTRATOR,
        FunctionCalledEnum.CREATE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    if (!(await this.emailValidatorService.validate(email))) {
      throw new Error('You must register this email before creating the user.');
    }

    const userAdministrator = new UserAdministrator({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday: new Date(birthday),
      graduation,
      salary: new Salary(salary),
    });

    const userVerification =
      await this._userAdministratorRepository.findByEmail(
        userAdministrator.email
      );
    if (userVerification) throw new Error('User already exists');

    const result =
      await this._userAdministratorRepository.create(userAdministrator);

    return { id: result };
  }
}
