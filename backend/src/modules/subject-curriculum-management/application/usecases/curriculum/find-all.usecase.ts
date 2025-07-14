import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllCurriculumInputDto,
  FindAllCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class FindAllCurriculum
  implements
    UseCaseInterface<FindAllCurriculumInputDto, FindAllCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { offset, quantity }: FindAllCurriculumInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindAllCurriculumOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.CURRICULUM,
        FunctionCalledEnum.FIND_ALL,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

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
