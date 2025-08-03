import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserTeacherInputDto,
  FindAllUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class FindAllUserTeacher
  implements
    UseCaseInterface<FindAllUserTeacherInputDto, FindAllUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    { offset, quantity }: FindAllUserTeacherInputDto,
    token?: TokenData
  ): Promise<FindAllUserTeacherOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.FIND_ALL,
      token
    );

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
