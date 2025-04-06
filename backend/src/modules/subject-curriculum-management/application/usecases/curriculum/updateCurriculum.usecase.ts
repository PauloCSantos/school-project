import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateCurriculumInputDto,
  UpdateCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';

export default class UpdateCurriculum
  implements
    UseCaseInterface<UpdateCurriculumInputDto, UpdateCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute({
    id,
    name,
    yearsToComplete,
  }: UpdateCurriculumInputDto): Promise<UpdateCurriculumOutputDto> {
    const curriculum = await this._curriculumRepository.find(id);
    if (!curriculum) throw new Error('Curriculum not found');

    try {
      name !== undefined && (curriculum.name = name);
      yearsToComplete !== undefined && (curriculum.year = yearsToComplete);

      const result = await this._curriculumRepository.update(curriculum);

      return {
        id: result.id.id,
        name: result.name,
        yearsToComplete: result.yearsToComplete,
      };
    } catch (error) {
      throw error;
    }
  }
}
