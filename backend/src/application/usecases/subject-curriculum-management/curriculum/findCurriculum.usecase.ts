import {
  FindCurriculumInputDto,
  FindCurriculumOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/infraestructure/gateway/subject-curriculum-management/curriculum.gateway';

export default class FindCurriculum
  implements
    UseCaseInterface<
      FindCurriculumInputDto,
      FindCurriculumOutputDto | undefined
    >
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute({
    id,
  }: FindCurriculumInputDto): Promise<FindCurriculumOutputDto | undefined> {
    const response = await this._curriculumRepository.find(id);
    if (response) {
      return {
        id: response.id.id,
        name: response.name,
        subjectsList: response.subjectList,
        yearsToComplete: response.yearsToComplete,
      };
    } else {
      return response;
    }
  }
}
