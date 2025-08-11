import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllCurriculumInputDto,
  FindAllCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class FindAllCurriculum
  implements
    UseCaseInterface<FindAllCurriculumInputDto, FindAllCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { offset, quantity }: FindAllCurriculumInputDto,
    token?: TokenData
  ): Promise<FindAllCurriculumOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._curriculumRepository.findAll(quantity, offset);

    const result = results.map(curriculum => ({
      id: curriculum.id.value,
      name: curriculum.name,
      subjectsList: curriculum.subjectList,
      yearsToComplete: curriculum.yearsToComplete,
    }));

    return result;
  }
}
