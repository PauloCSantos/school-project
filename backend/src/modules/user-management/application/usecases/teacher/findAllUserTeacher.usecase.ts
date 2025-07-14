import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserTeacherInputDto,
  FindAllUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/infrastructure/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class FindAllUserTeacher
  implements
    UseCaseInterface<FindAllUserTeacherInputDto, FindAllUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(userTeacherRepository: UserTeacherGateway) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    { offset, quantity }: FindAllUserTeacherInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindAllUserTeacherOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.TEACHER,
        FunctionCalledEnum.FIND_ALL,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const results = await this._userTeacherRepository.findAll(quantity, offset);

    const result = results.map(userTeacher => ({
      id: userTeacher.id.value,
      name: {
        fullName: userTeacher.name.fullName(),
        shortName: userTeacher.name.shortName(),
      },
      address: {
        street: userTeacher.address.street,
        city: userTeacher.address.city,
        zip: userTeacher.address.zip,
        number: userTeacher.address.number,
        avenue: userTeacher.address.avenue,
        state: userTeacher.address.state,
      },
      email: userTeacher.email,
      birthday: userTeacher.birthday,
      salary: userTeacher.salary.calculateTotalIncome(),
      graduation: userTeacher.graduation,
      academicDegrees: userTeacher.academicDegrees,
    }));

    return result;
  }
}
