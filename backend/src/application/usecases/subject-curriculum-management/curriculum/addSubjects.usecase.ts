import {
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/modules/subject-curriculum-management/curriculum/gateway/curriculum.gateway';

export default class AddSubjects
  implements UseCaseInterface<AddSubjectsInputDto, AddSubjectsOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute({
    id,
    newSubjectsList,
  }: AddSubjectsInputDto): Promise<AddSubjectsOutputDto> {
    const curriculumVerification = await this._curriculumRepository.find(id);
    if (!curriculumVerification) throw new Error('Curriculum not found');

    try {
      newSubjectsList.forEach(subjectId => {
        curriculumVerification.addSubject(subjectId);
      });
      const result = await this._curriculumRepository.addSubjects(
        id,
        newSubjectsList
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
