import {
  FindUserStudentInputDto,
  FindUserStudentOutputDto,
} from '@/application/dto/user-management/student-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserStudentGateway from '@/modules/user-management/student/gateway/user-student.gateway';

export default class FindUserStudent
  implements
    UseCaseInterface<
      FindUserStudentInputDto,
      FindUserStudentOutputDto | undefined
    >
{
  private _userStudentRepository: UserStudentGateway;

  constructor(userStudentRepository: UserStudentGateway) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute({
    id,
  }: FindUserStudentInputDto): Promise<FindUserStudentOutputDto | undefined> {
    const response = await this._userStudentRepository.find(id);
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
        paymentYear: response.paymentWithCurrencyBR(),
      };
    } else {
      return response;
    }
  }
}
