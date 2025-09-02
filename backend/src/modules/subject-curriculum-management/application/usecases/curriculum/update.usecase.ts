import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateCurriculumInputDto,
  UpdateCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { CurriculumNotFoundError } from '../../errors/curriculum-not-found.error';

export default class UpdateCurriculum
  implements UseCaseInterface<UpdateCurriculumInputDto, UpdateCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id, name, yearsToComplete }: UpdateCurriculumInputDto,
    token: TokenData
  ): Promise<UpdateCurriculumOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.UPDATE,
      token
    );

    const curriculum = await this._curriculumRepository.find(token.masterId, id);
    if (!curriculum) throw new CurriculumNotFoundError(id);

    name !== undefined && (curriculum.name = name);
    yearsToComplete !== undefined && (curriculum.year = yearsToComplete);

    if (curriculum.isPending) {
      curriculum.markVerified();
    }

    const result = await this._curriculumRepository.update(token.masterId, curriculum);

    return {
      id: result.id.value,
      name: result.name,
      yearsToComplete: result.yearsToComplete,
    };
  }
}
