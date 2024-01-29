import {
  UpdateUserStudentInputDto,
  UpdateUserStudentOutputDto,
} from '@/application/dto/user-management/student-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserStudentGateway from '@/infraestructure/gateway/user-management-repository/user-student.gateway';

export default class UpdateUserStudent
  implements
    UseCaseInterface<UpdateUserStudentInputDto, UpdateUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(userStudentRepository: UserStudentGateway) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute({
    id,
    name,
    address,
    email,
    birthday,
    paymentYear,
  }: UpdateUserStudentInputDto): Promise<UpdateUserStudentOutputDto> {
    const userStudent = await this._userStudentRepository.find(id);
    if (!userStudent) throw new Error('User not found');

    name?.firstName && (userStudent.name.firstName = name.firstName);
    name?.middleName && (userStudent.name.middleName = name.middleName);
    name?.lastName && (userStudent.name.lastName = name.lastName);
    address?.street && (userStudent.address.street = address.street);
    address?.city && (userStudent.address.city = address.city);
    address?.zip && (userStudent.address.zip = address.zip);
    address?.number && (userStudent.address.number = address.number);
    address?.avenue && (userStudent.address.avenue = address.avenue);
    address?.state && (userStudent.address.state = address.state);
    email && (userStudent.email = email);
    birthday && (userStudent.birthday = birthday);
    paymentYear && (userStudent.paymentYear = paymentYear);

    const result = await this._userStudentRepository.update(userStudent);

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
      paymentYear: result.paymentWithCurrencyBR(),
    };
  }
}
