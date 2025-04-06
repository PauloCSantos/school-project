import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserTeacherInputDto,
  FindUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/infrastructure/gateway/user-teacher.gateway';

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
        id: response.id.value,
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
