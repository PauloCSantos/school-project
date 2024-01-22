import {
  CreateUserAdministratorInputDto,
  CreateUserAdministratorOutputDto,
} from '@/application/dto/user-management/administrator-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserAdministratorGateway from '@/modules/user-management/administrator/gateway/user-administrator.gateway';
import UserAdministrator from '@/modules/user-management/administrator/domain/entity/user-administrator.entity';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';

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

    const result =
      await this._userAdministratorRepository.create(userAdministrator);

    return { id: result };
  }
}
