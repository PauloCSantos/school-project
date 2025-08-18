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
import { TeacherMapper } from '@/modules/user-management/infrastructure/mapper/teacher.mapper';

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
    token: TokenData
  ): Promise<FindUserTeacherOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userTeacherRepository.find(token.masterId, id);
    if (response) {
      return TeacherMapper.toDTO(response);
    }
    return null;
  }
}
