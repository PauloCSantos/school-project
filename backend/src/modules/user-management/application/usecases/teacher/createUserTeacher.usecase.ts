import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';
import {
  CreateUserTeacherInputDto,
  CreateUserTeacherOutputDto,
} from '../../../application/dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { ConflictError } from '@/modules/@shared/application/errors/conflict.error';

export default class CreateUserTeacher
  implements UseCaseInterface<CreateUserTeacherInputDto, CreateUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
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
    token: TokenData
  ): Promise<CreateUserTeacherOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.CREATE,
      token
    );

    if (!(await this.emailValidatorService.validate(email))) {
      throw new ConflictError('You must register this email before creating the user.');
    }

    const baseUser = await this.userService.getOrCreateUser(email, {
      email: email,
      name: new Name(name),
      address: new Address(address),
      birthday: new Date(birthday),
    });

    const userTeacher = new UserTeacher({
      userId: baseUser.id.value,
      graduation,
      salary: new Salary(salary),
      academicDegrees,
    });

    const userVerification = await this._userTeacherRepository.findByBaseUserId(
      token.masterId,
      baseUser.id.value
    );
    if (userVerification) throw new ConflictError('User already exists');

    const result = await this._userTeacherRepository.create(token.masterId, userTeacher);

    return { id: result };
  }
}
