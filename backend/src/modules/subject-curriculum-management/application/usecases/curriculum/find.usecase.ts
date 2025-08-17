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
import { CurriculumMapper } from '@/modules/subject-curriculum-management/infrastructure/mapper/curriculum.mapper';

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
    token: TokenData
  ): Promise<FindCurriculumOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._curriculumRepository.find(token.masterId, id);
    if (response) {
      return CurriculumMapper.toObj(response);
    }
    return null;
  }
}
