import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';
import {
  CreateUserTeacherInputDto,
  CreateUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/infrastructure/gateway/teacher.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class CreateUserTeacher
  implements
    UseCaseInterface<CreateUserTeacherInputDto, CreateUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    readonly emailValidatorService: EmailAuthValidator
  ) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    {
      name,
      address,
      email,
      birthday,
      graduation,
      salary,
      academicDegrees,
    }: CreateUserTeacherInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<CreateUserTeacherOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.TEACHER,
        FunctionCalledEnum.CREATE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    if (!(await this.emailValidatorService.validate(email))) {
      throw new Error('You must register this email before creating the user.');
    }

    const userTeacher = new UserTeacher({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday: new Date(birthday),
      graduation,
      salary: new Salary(salary),
      academicDegrees,
    });

    const userVerification = await this._userTeacherRepository.findByEmail(
      userTeacher.email
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userTeacherRepository.create(userTeacher);

    return { id: result };
  }
}
