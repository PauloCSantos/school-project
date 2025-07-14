import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindSubjectInputDto,
  FindSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class FindSubject
  implements UseCaseInterface<FindSubjectInputDto, FindSubjectOutputDto | null>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { id }: FindSubjectInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindSubjectOutputDto | null> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SUBJECT,
        FunctionCalledEnum.FIND,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const response = await this._subjectRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        name: response.name,
        description: response.description,
      };
    } else {
      return response;
    }
  }
}
