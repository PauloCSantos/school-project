import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserTeacherInputDto,
  UpdateUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/infrastructure/gateway/user-teacher.gateway';

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

    try {
      name?.firstName !== undefined &&
        (userTeacher.name.firstName = name.firstName);
      name?.middleName !== undefined &&
        (userTeacher.name.middleName = name.middleName);
      name?.lastName !== undefined &&
        (userTeacher.name.lastName = name.lastName);
      address?.street !== undefined &&
        (userTeacher.address.street = address.street);
      address?.city !== undefined && (userTeacher.address.city = address.city);
      address?.zip !== undefined && (userTeacher.address.zip = address.zip);
      address?.number !== undefined &&
        (userTeacher.address.number = address.number);
      address?.avenue !== undefined &&
        (userTeacher.address.avenue = address.avenue);
      address?.state !== undefined &&
        (userTeacher.address.state = address.state);
      email !== undefined && (userTeacher.email = email);
      birthday !== undefined && (userTeacher.birthday = birthday);
      graduation !== undefined && (userTeacher.graduation = graduation);
      salary?.currency !== undefined &&
        (userTeacher.salary.currency = salary.currency);
      salary?.salary !== undefined &&
        (userTeacher.salary.salary = salary.salary);
      academicDegrees !== undefined &&
        (userTeacher.academicDegrees = academicDegrees);

      const result = await this._userTeacherRepository.update(userTeacher);

      return {
        id: result.id.id,
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
    } catch (error) {
      throw error;
    }
  }
}
