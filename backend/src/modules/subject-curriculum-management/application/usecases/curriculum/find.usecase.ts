import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindCurriculumInputDto,
  FindCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class FindCurriculum
  implements
    UseCaseInterface<FindCurriculumInputDto, FindCurriculumOutputDto | null>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id }: FindCurriculumInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindCurriculumOutputDto | null> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.CURRICULUM,
        FunctionCalledEnum.FIND,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const response = await this._curriculumRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        name: response.name,
        subjectsList: response.subjectList,
        yearsToComplete: response.yearsToComplete,
      };
    } else {
      return response;
    }
  }
}
