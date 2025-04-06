import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import UserStudent from '@/modules/user-management/domain/entity/user-student.entity';
import {
  CreateUserStudentInputDto,
  CreateUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/infrastructure/gateway/user-student.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';

export default class CreateUserStudent
  implements
    UseCaseInterface<CreateUserStudentInputDto, CreateUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(userStudentRepository: UserStudentGateway) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute({
    name,
    address,
    email,
    birthday,
    paymentYear,
  }: CreateUserStudentInputDto): Promise<CreateUserStudentOutputDto> {
    const userStudent = new UserStudent({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday,
      paymentYear,
    });

    const userVerification = await this._userStudentRepository.find(
      userStudent.id.value
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userStudentRepository.create(userStudent);

    return { id: result };
  }
}
