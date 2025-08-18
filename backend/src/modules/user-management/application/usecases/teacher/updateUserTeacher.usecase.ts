import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserTeacherInputDto,
  UpdateUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { TeacherMapper } from '@/modules/user-management/infrastructure/mapper/teacher.mapper';

export default class UpdateUserTeacher
  implements
    UseCaseInterface<UpdateUserTeacherInputDto, UpdateUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    private readonly policiesService: PoliciesServiceInterface
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

    const userTeacher = await this._userTeacherRepository.find(
      token.masterId,
      id
    );
    if (!userTeacher) throw new Error('User not found');

    name?.firstName !== undefined &&
      (userTeacher.name.firstName = name.firstName);
    name?.middleName !== undefined &&
      (userTeacher.name.middleName = name.middleName);
    name?.lastName !== undefined && (userTeacher.name.lastName = name.lastName);
    address?.street !== undefined &&
      (userTeacher.address.street = address.street);
    address?.city !== undefined && (userTeacher.address.city = address.city);
    address?.zip !== undefined && (userTeacher.address.zip = address.zip);
    address?.number !== undefined &&
      (userTeacher.address.number = address.number);
    address?.avenue !== undefined &&
      (userTeacher.address.avenue = address.avenue);
    address?.state !== undefined && (userTeacher.address.state = address.state);
    email !== undefined && (userTeacher.email = email);
    birthday !== undefined && (userTeacher.birthday = new Date(birthday));
    graduation !== undefined && (userTeacher.graduation = graduation);
    salary?.currency !== undefined &&
      (userTeacher.salary.currency = salary.currency);
    salary?.salary !== undefined && (userTeacher.salary.salary = salary.salary);
    academicDegrees !== undefined &&
      (userTeacher.academicDegrees = academicDegrees);

    const result = await this._userTeacherRepository.update(
      token.masterId,
      userTeacher
    );

    return TeacherMapper.toDTO(result);
  }
}
