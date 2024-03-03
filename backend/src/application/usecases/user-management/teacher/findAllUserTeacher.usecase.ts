import {
  FindAllUserTeacherInputDto,
  FindAllUserTeacherOutputDto,
} from '@/application/dto/user-management/teacher-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserTeacherGateway from '@/infraestructure/gateway/user-management-repository/user-teacher.gateway';

export default class FindAllUserTeacher
  implements
    UseCaseInterface<FindAllUserTeacherInputDto, FindAllUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(userTeacherRepository: UserTeacherGateway) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllUserTeacherInputDto): Promise<FindAllUserTeacherOutputDto> {
    const results = await this._userTeacherRepository.findAll(offset, quantity);

    const result = results.map(userTeacher => ({
      id: userTeacher.id.id,
      name: {
        fullName: userTeacher.name.fullName(),
        shortName: userTeacher.name.shortName(),
      },
      address: {
        street: userTeacher.address.street,
        city: userTeacher.address.city,
        zip: userTeacher.address.zip,
        number: userTeacher.address.number,
        avenue: userTeacher.address.avenue,
        state: userTeacher.address.state,
      },
      email: userTeacher.email,
      birthday: userTeacher.birthday,
      salary: userTeacher.salary.calculateTotalIncome(),
      graduation: userTeacher.graduation,
      academicDegrees: userTeacher.academicDegrees,
    }));

    return result;
  }
}
