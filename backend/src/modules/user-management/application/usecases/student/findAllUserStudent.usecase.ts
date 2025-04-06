import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserStudentInputDto,
  FindAllUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/infrastructure/gateway/user-student.gateway';

export default class FindAllUserStudent
  implements
    UseCaseInterface<FindAllUserStudentInputDto, FindAllUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(userStudentRepository: UserStudentGateway) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllUserStudentInputDto): Promise<FindAllUserStudentOutputDto> {
    const results = await this._userStudentRepository.findAll(offset, quantity);

    const result = results.map(userStudent => ({
      id: userStudent.id.value,
      name: {
        fullName: userStudent.name.fullName(),
        shortName: userStudent.name.shortName(),
      },
      address: {
        street: userStudent.address.street,
        city: userStudent.address.city,
        zip: userStudent.address.zip,
        number: userStudent.address.number,
        avenue: userStudent.address.avenue,
        state: userStudent.address.state,
      },
      email: userStudent.email,
      birthday: userStudent.birthday,
      paymentYear: userStudent.paymentWithCurrencyBR(),
    }));

    return result;
  }
}
