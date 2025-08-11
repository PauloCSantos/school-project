import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserTeacherInputDto,
  FindUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class FindUserTeacher
  implements
    UseCaseInterface<FindUserTeacherInputDto, FindUserTeacherOutputDto | null>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    { id }: FindUserTeacherInputDto,
    token?: TokenData
  ): Promise<FindUserTeacherOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userTeacherRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        name: {
          fullName: response.name.fullName(),
          shortName: response.name.shortName(),
        },
        address: {
          street: response.address.street,
          city: response.address.city,
          zip: response.address.zip,
          number: response.address.number,
          avenue: response.address.avenue,
          state: response.address.state,
        },
        email: response.email,
        birthday: response.birthday,
        salary: response.salary.calculateTotalIncome(),
        graduation: response.graduation,
        academicDegrees: response.academicDegrees,
      };
    } else {
      return response;
    }
  }
}
