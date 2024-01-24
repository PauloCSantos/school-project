import {
  CreateUserStudentInputDto,
  CreateUserStudentOutputDto,
} from '@/application/dto/user-management/student-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserStudentGateway from '@/modules/user-management/student/gateway/user-student.gateway';
import UserStudent from '@/modules/user-management/student/domain/entity/user-student.entity';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';

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
      userStudent.id.id
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userStudentRepository.create(userStudent);

    return { id: result };
  }
}
