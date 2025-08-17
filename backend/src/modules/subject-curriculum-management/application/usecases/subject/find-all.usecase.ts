import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllSubjectInputDto,
  FindAllSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/application/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { SubjectMapper } from '@/modules/subject-curriculum-management/infrastructure/mapper/subject.mapper';

export default class FindAllSubject
  implements UseCaseInterface<FindAllSubjectInputDto, FindAllSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(
    subjectRepository: SubjectGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { offset, quantity }: FindAllSubjectInputDto,
    token: TokenData
  ): Promise<FindAllSubjectOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SUBJECT,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._subjectRepository.findAll(
      token.masterId,
      quantity,
      offset
    );

    return SubjectMapper.toObjList(results);
  }
}
