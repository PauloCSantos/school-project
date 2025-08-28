import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserTeacherInputDto,
  UpdateUserTeacherOutputDto,
} from '../../../application/dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { TeacherAssembler } from '../../assemblers/teacher.assembler';

export default class UpdateUserTeacher
  implements UseCaseInterface<UpdateUserTeacherInputDto, UpdateUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    {
      id,
      name,
      address,
      email,
      birthday,
      graduation,
      salary,
      academicDegrees,
    }: UpdateUserTeacherInputDto,
    token: TokenData
  ): Promise<UpdateUserTeacherOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.UPDATE,
      token
    );

    const userTeacher = await this._userTeacherRepository.find(token.masterId, id);
    if (!userTeacher) throw new Error('User not found');
    const baseUser = await this.userService.findBaseUser(userTeacher.userId);

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
    graduation !== undefined && (userTeacher.graduation = graduation);
    salary?.currency !== undefined && (userTeacher.salary.currency = salary.currency);
    salary?.salary !== undefined && (userTeacher.salary.salary = salary.salary);
    academicDegrees !== undefined && (userTeacher.academicDegrees = academicDegrees);

    if (userTeacher.isPending) {
      userTeacher.markVerified();
    }

    const baseUserUpdated = await this.userService.update(baseUser!);
    const result = await this._userTeacherRepository.update(token.masterId, userTeacher);

    return TeacherAssembler.toObj(baseUserUpdated, result);
  }
}
