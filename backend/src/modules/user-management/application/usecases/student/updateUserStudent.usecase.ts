import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserStudentInputDto,
  UpdateUserStudentOutputDto,
} from '../../../application/dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { StudentAssembler } from '../../assemblers/student.assembler';

export default class UpdateUserStudent
  implements UseCaseInterface<UpdateUserStudentInputDto, UpdateUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(
    userStudentRepository: UserStudentGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    { id, name, address, email, birthday, paymentYear }: UpdateUserStudentInputDto,
    token: TokenData
  ): Promise<UpdateUserStudentOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.UPDATE,
      token
    );

    const userStudent = await this._userStudentRepository.find(token.masterId, id);
    if (!userStudent) throw new Error('User not found');
    const baseUser = await this.userService.findBaseUser(userStudent.userId);

    name?.firstName !== undefined && (baseUser!.name.firstName = name.firstName);
    name?.middleName !== undefined && (baseUser!.name.middleName = name.middleName);
    name?.lastName !== undefined && (baseUser!.name.lastName = name.lastName);
    address?.street !== undefined && (baseUser!.address.street = address.street);
    address?.city !== undefined && (baseUser!.address.city = address.city);
    address?.zip !== undefined && (baseUser!.address.zip = address.zip);
    address?.number !== undefined && (baseUser!.address.number = address.number);
    address?.avenue !== undefined && (baseUser!.address.avenue = address.avenue);
    address?.state !== undefined && (baseUser!.address.state = address.state);
    email !== undefined && (baseUser!.email = email);
    birthday !== undefined && (baseUser!.birthday = new Date(birthday));
    paymentYear !== undefined && (userStudent.paymentYear = paymentYear);

    const baseUserUpdated = await this.userService.update(baseUser!);
    const result = await this._userStudentRepository.update(token.masterId, userStudent);

    return StudentAssembler.toObj(baseUserUpdated, result);
  }
}
