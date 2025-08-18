import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindSubjectInputDto,
  FindSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/application/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { SubjectMapper } from '@/modules/subject-curriculum-management/infrastructure/mapper/subject.mapper';

export default class FindSubject
  implements UseCaseInterface<FindSubjectInputDto, FindSubjectOutputDto | null>
{
  private _subjectRepository: SubjectGateway;

  constructor(
    subjectRepository: SubjectGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { id }: FindSubjectInputDto,
    token: TokenData
  ): Promise<FindSubjectOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SUBJECT,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._subjectRepository.find(token.masterId, id);
    if (response) {
      return SubjectMapper.toObj(response);
    }
    return null;
  }
}
