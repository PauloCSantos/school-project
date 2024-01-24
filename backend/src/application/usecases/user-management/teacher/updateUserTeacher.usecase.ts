import {
  UpdateUserTeacherInputDto,
  UpdateUserTeacherOutputDto,
} from '@/application/dto/user-management/teacher-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserTeacherGateway from '@/modules/user-management/teacher/gateway/user-teacher.gateway';

export default class UpdateUserTeacher
  implements
    UseCaseInterface<UpdateUserTeacherInputDto, UpdateUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(userTeacherRepository: UserTeacherGateway) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute({
    id,
    name,
    address,
    email,
    birthday,
    graduation,
    salary,
    academicDegrees,
  }: UpdateUserTeacherInputDto): Promise<UpdateUserTeacherOutputDto> {
    const userTeacher = await this._userTeacherRepository.find(id);
    if (!userTeacher) throw new Error('User not found');

    name?.firstName && (userTeacher.name.firstName = name.firstName);
    name?.middleName && (userTeacher.name.middleName = name.middleName);
    name?.lastName && (userTeacher.name.lastName = name.lastName);
    address?.street && (userTeacher.address.street = address.street);
    address?.city && (userTeacher.address.city = address.city);
    address?.zip && (userTeacher.address.zip = address.zip);
    address?.number && (userTeacher.address.number = address.number);
    address?.avenue && (userTeacher.address.avenue = address.avenue);
    address?.state && (userTeacher.address.state = address.state);
    email && (userTeacher.email = email);
    birthday && (userTeacher.birthday = birthday);
    graduation && (userTeacher.graduation = graduation);
    salary?.currency && (userTeacher.salary.currency = salary.currency);
    salary?.salary && (userTeacher.salary.salary = salary.salary);
    academicDegrees && (userTeacher.academicDegrees = academicDegrees);

    const result = await this._userTeacherRepository.update(userTeacher);

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
      academicDegrees: result.academicDegrees,
    };
  }
}
