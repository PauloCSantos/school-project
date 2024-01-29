import {
  CreateUserTeacherInputDto,
  CreateUserTeacherOutputDto,
} from '@/application/dto/user-management/teacher-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserTeacherGateway from '@/infraestructure/gateway/user-management-repository/user-teacher.gateway';
import UserTeacher from '@/modules/user-management/domain/entity/user-teacher.entity';

export default class CreateUserTeacher
  implements
    UseCaseInterface<CreateUserTeacherInputDto, CreateUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(userTeacherRepository: UserTeacherGateway) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute({
    name,
    address,
    email,
    birthday,
    graduation,
    salary,
    academicDegrees,
  }: CreateUserTeacherInputDto): Promise<CreateUserTeacherOutputDto> {
    const userTeacher = new UserTeacher({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday,
      graduation,
      salary: new Salary(salary),
      academicDegrees,
    });

    const userVerification = await this._userTeacherRepository.find(
      userTeacher.id.id
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userTeacherRepository.create(userTeacher);

    return { id: result };
  }
}
