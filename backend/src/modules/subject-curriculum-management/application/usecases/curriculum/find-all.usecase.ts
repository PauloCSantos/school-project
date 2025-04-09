import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllCurriculumInputDto,
  FindAllCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';

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
      id: curriculum.id.value,
      name: curriculum.name,
      subjectsList: curriculum.subjectList,
      yearsToComplete: curriculum.yearsToComplete,
    }));

    return result;
  }
}
