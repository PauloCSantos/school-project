import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateCurriculumInputDto,
  CreateCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class CreateCurriculum
  implements
    UseCaseInterface<CreateCurriculumInputDto, CreateCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { name, subjectsList, yearsToComplete }: CreateCurriculumInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<CreateCurriculumOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.CURRICULUM,
        FunctionCalledEnum.CREATE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const curriculum = new Curriculum({
      name,
      subjectsList,
      yearsToComplete,
    });

    const curriculumVerification = await this._curriculumRepository.find(
      curriculum.id.value
    );
    if (curriculumVerification) throw new Error('Curriculum already exists');

    const result = await this._curriculumRepository.create(curriculum);

    return { id: result };
  }
}
