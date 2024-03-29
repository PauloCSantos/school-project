import {
  CreateUserAdministratorInputDto,
  CreateUserAdministratorOutputDto,
} from '@/application/dto/user-management/administrator-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';

import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserAdministratorGateway from '@/infraestructure/gateway/user-management-repository/user-administrator.gateway';
import UserAdministrator from '@/modules/user-management/domain/entity/user-administrator.entity';

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
      userAdministrator.id.id
    );
    if (userVerification) throw new Error('User already exists');

    const result =
      await this._userAdministratorRepository.create(userAdministrator);

    return { id: result };
  }
}
