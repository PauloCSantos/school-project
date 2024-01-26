import {
  UpdateCurriculumInputDto,
  UpdateCurriculumOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/modules/subject-curriculum-management/curriculum/gateway/curriculum.gateway';

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

    name && (curriculum.name = name);
    yearsToComplete && (curriculum.year = yearsToComplete);

    const result = await this._curriculumRepository.update(curriculum);

    return {
      name: result.name,
      yearsToComplete: result.yearsToComplete,
    };
  }
}
