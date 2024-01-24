import {
  FindUserTeacherInputDto,
  FindUserTeacherOutputDto,
} from '@/application/dto/user-management/teacher-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserTeacherGateway from '@/modules/user-management/teacher/gateway/user-teacher.gateway';

export default class FindUserTeacher
  implements
    UseCaseInterface<
      FindUserTeacherInputDto,
      FindUserTeacherOutputDto | undefined
    >
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(userTeacherRepository: UserTeacherGateway) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute({
    id,
  }: FindUserTeacherInputDto): Promise<FindUserTeacherOutputDto | undefined> {
    const response = await this._userTeacherRepository.find(id);
    if (response) {
      return {
        name: {
          fullName: response.name.fullName(),
          shortName: response.name.shortName(),
        },
        address: {
          street: response.address.street,
          city: response.address.city,
          zip: response.address.zip,
          number: response.address.number,
          avenue: response.address.avenue,
          state: response.address.state,
        },
        email: response.email,
        birthday: response.birthday,
        salary: response.salary.calculateTotalIncome(),
        graduation: response.graduation,
        academicDegrees: response.academicDegrees,
      };
    } else {
      return response;
    }
  }
}
