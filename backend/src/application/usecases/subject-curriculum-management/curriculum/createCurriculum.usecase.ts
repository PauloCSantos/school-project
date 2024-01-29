import {
  CreateCurriculumInputDto,
  CreateCurriculumOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/infraestructure/gateway/subject-curriculum-management/curriculum.gateway';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

export default class CreateCurriculum
  implements
    UseCaseInterface<CreateCurriculumInputDto, CreateCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute({
    name,
    subjectsList,
    yearsToComplete,
  }: CreateCurriculumInputDto): Promise<CreateCurriculumOutputDto> {
    const curriculum = new Curriculum({
      name,
      subjectsList,
      yearsToComplete,
    });

    const curriculumVerification = await this._curriculumRepository.find(
      curriculum.id.id
    );
    if (curriculumVerification) throw new Error('Curriculum already exists');

    const result = await this._curriculumRepository.create(curriculum);

    return { id: result };
  }
}
