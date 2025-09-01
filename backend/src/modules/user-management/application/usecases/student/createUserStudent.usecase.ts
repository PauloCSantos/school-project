import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';
import {
  CreateUserStudentInputDto,
  CreateUserStudentOutputDto,
} from '../../../application/dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { ConflictError } from '@/modules/@shared/application/errors/conflict.error';

export default class CreateUserStudent
  implements UseCaseInterface<CreateUserStudentInputDto, CreateUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(
    userStudentRepository: UserStudentGateway,
    readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    { name, address, email, birthday, paymentYear }: CreateUserStudentInputDto,
    token: TokenData
  ): Promise<CreateUserStudentOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
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

    const userStudent = new UserStudent({
      userId: baseUser.id.value,
      paymentYear,
    });

    const userVerification = await this._userStudentRepository.findByBaseUserId(
      token.masterId,
      baseUser.id.value
    );
    if (userVerification) throw new ConflictError('User already exists');

    const result = await this._userStudentRepository.create(token.masterId, userStudent);

    return { id: result };
  }
}
