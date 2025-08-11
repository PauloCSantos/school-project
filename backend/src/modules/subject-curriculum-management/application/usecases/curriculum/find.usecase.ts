import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindCurriculumInputDto,
  FindCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class FindCurriculum
  implements
    UseCaseInterface<FindCurriculumInputDto, FindCurriculumOutputDto | null>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id }: FindCurriculumInputDto,
    token?: TokenData
  ): Promise<FindCurriculumOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.FIND,
      token
    );

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
