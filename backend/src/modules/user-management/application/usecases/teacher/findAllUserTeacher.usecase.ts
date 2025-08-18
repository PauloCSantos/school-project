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
import { TeacherMapper } from '@/modules/user-management/infrastructure/mapper/teacher.mapper';

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
    token: TokenData
  ): Promise<FindAllUserTeacherOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._userTeacherRepository.findAll(
      token.masterId,
      quantity,
      offset
    );

    return TeacherMapper.toDTOList(results);
  }
}
