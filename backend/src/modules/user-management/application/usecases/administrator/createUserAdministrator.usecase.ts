import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateUserAdministratorInputDto,
  CreateUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministratorGateway from '@/modules/user-management/infrastructure/gateway/administrator.gateway';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';

export default class CreateUserAdministrator
  implements
    UseCaseInterface<
      CreateUserAdministratorInputDto,
      CreateUserAdministratorOutputDto
    >
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(userAdministratorRepository: UserAdministratorGateway) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute({
    name,
    address,
    email,
    birthday,
    graduation,
    salary,
  }: CreateUserAdministratorInputDto): Promise<CreateUserAdministratorOutputDto> {
    const userAdministrator = new UserAdministrator({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday,
      graduation,
      salary: new Salary(salary),
    });

    const userVerification = await this._userAdministratorRepository.find(
      userAdministrator.id.value
    );
    if (userVerification) throw new Error('User already exists');

    const result =
      await this._userAdministratorRepository.create(userAdministrator);

    return { id: result };
  }
}
