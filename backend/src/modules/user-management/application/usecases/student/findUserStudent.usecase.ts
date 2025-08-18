import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserStudentInputDto,
  FindUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { StudentMapper } from '@/modules/user-management/infrastructure/mapper/student.mapper';

export default class FindUserStudent
  implements
    UseCaseInterface<FindUserStudentInputDto, FindUserStudentOutputDto | null>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(
    userStudentRepository: UserStudentGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    { id }: FindUserStudentInputDto,
    token: TokenData
  ): Promise<FindUserStudentOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userStudentRepository.find(token.masterId, id);
    if (response) {
      return StudentMapper.toObj(response);
    }
    return null;
  }
}
