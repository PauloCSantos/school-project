import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateCurriculumInputDto,
  CreateCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class CreateCurriculum
  implements
    UseCaseInterface<CreateCurriculumInputDto, CreateCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { name, subjectsList, yearsToComplete }: CreateCurriculumInputDto,
    token: TokenData
  ): Promise<CreateCurriculumOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.CREATE,
      token
    );

    const curriculum = new Curriculum({
      name,
      subjectsList,
      yearsToComplete,
    });

    const result = await this._curriculumRepository.create(
      token.masterId,
      curriculum
    );

    return { id: result };
  }
}
