import {
  FindAllCurriculumInputDto,
  FindAllCurriculumOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/infraestructure/gateway/subject-curriculum-management/curriculum.gateway';

export default class FindAllCurriculum
  implements
    UseCaseInterface<FindAllCurriculumInputDto, FindAllCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllCurriculumInputDto): Promise<FindAllCurriculumOutputDto> {
    const results = await this._curriculumRepository.findAll(offset, quantity);

    const result = results.map(curriculum => ({
      id: curriculum.id.id,
      name: curriculum.name,
      subjectsList: curriculum.subjectList,
      yearsToComplete: curriculum.yearsToComplete,
    }));

    return result;
  }
}
