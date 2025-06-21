import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserStudentInputDto,
  FindUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/infrastructure/gateway/student.gateway';

export default class FindUserStudent
  implements
    UseCaseInterface<FindUserStudentInputDto, FindUserStudentOutputDto | null>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(userStudentRepository: UserStudentGateway) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute({
    id,
  }: FindUserStudentInputDto): Promise<FindUserStudentOutputDto | null> {
    const response = await this._userStudentRepository.find(id);
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
        paymentYear: response.paymentWithCurrencyBR(),
      };
    } else {
      return response;
    }
  }
}
