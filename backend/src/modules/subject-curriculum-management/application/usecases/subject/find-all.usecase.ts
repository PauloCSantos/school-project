import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllSubjectInputDto,
  FindAllSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class FindAllSubject
  implements UseCaseInterface<FindAllSubjectInputDto, FindAllSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { offset, quantity }: FindAllSubjectInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindAllSubjectOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SUBJECT,
        FunctionCalledEnum.FIND_ALL,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const results = await this._subjectRepository.findAll(quantity, offset);

    const result = results.map(subject => ({
      id: subject.id.value,
      name: subject.name,
      description: subject.description,
    }));

    return result;
  }
}
