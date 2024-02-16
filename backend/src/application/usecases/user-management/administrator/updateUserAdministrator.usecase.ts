import {
  UpdateUserAdministratorInputDto,
  UpdateUserAdministratorOutputDto,
} from '@/application/dto/user-management/administrator-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserAdministratorGateway from '@/infraestructure/gateway/user-management-repository/user-administrator.gateway';

export default class UpdateUserAdministrator
  implements
    UseCaseInterface<
      UpdateUserAdministratorInputDto,
      UpdateUserAdministratorOutputDto
    >
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(userAdministratorRepository: UserAdministratorGateway) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute({
    id,
    name,
    address,
    email,
    birthday,
    graduation,
    salary,
  }: UpdateUserAdministratorInputDto): Promise<UpdateUserAdministratorOutputDto> {
    const userAdm = await this._userAdministratorRepository.find(id);
    if (!userAdm) throw new Error('User not found');

    try {
      name?.firstName !== undefined &&
        (userAdm.name.firstName = name.firstName);
      name?.middleName !== undefined &&
        (userAdm.name.middleName = name.middleName);
      name?.lastName !== undefined && (userAdm.name.lastName = name.lastName);
      address?.street !== undefined &&
        (userAdm.address.street = address.street);
      address?.city !== undefined && (userAdm.address.city = address.city);
      address?.zip !== undefined && (userAdm.address.zip = address.zip);
      address?.number !== undefined &&
        (userAdm.address.number = address.number);
      address?.avenue !== undefined &&
        (userAdm.address.avenue = address.avenue);
      address?.state !== undefined && (userAdm.address.state = address.state);
      email !== undefined && (userAdm.email = email);
      birthday !== undefined && (userAdm.birthday = birthday);
      graduation !== undefined && (userAdm.graduation = graduation);
      salary?.currency !== undefined &&
        (userAdm.salary.currency = salary.currency);
      salary?.salary !== undefined && (userAdm.salary.salary = salary.salary);

      const result = await this._userAdministratorRepository.update(userAdm);

      return {
        name: {
          fullName: result.name.fullName(),
          shortName: result.name.shortName(),
        },
        address: {
          street: result.address.street,
          city: result.address.city,
          zip: result.address.zip,
          number: result.address.number,
          avenue: result.address.avenue,
          state: result.address.state,
        },
        email: result.email,
        birthday: result.birthday,
        salary: result.salary.calculateTotalIncome(),
        graduation: result.graduation,
      };
    } catch (error) {
      throw error;
    }
  }
}
