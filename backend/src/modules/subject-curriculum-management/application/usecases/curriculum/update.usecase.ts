import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateCurriculumInputDto,
  UpdateCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class UpdateCurriculum
  implements
    UseCaseInterface<UpdateCurriculumInputDto, UpdateCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id, name, yearsToComplete }: UpdateCurriculumInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<UpdateCurriculumOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.CURRICULUM,
        FunctionCalledEnum.ADD,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const curriculum = await this._curriculumRepository.find(id);
    if (!curriculum) throw new Error('Curriculum not found');

    try {
      name !== undefined && (curriculum.name = name);
      yearsToComplete !== undefined && (curriculum.year = yearsToComplete);

      const result = await this._curriculumRepository.update(curriculum);

      return {
        id: result.id.value,
        name: result.name,
        yearsToComplete: result.yearsToComplete,
      };
    } catch (error) {
      throw error;
    }
  }
}
