import {
  RemoveSubjectsInputDto,
  RemoveSubjectsOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/modules/subject-curriculum-management/curriculum/gateway/curriculum.gateway';

export default class RemoveSubjects
  implements UseCaseInterface<RemoveSubjectsInputDto, RemoveSubjectsOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute({
    id,
    subjectsListToRemove,
  }: RemoveSubjectsInputDto): Promise<RemoveSubjectsOutputDto> {
    const curriculumVerification = await this._curriculumRepository.find(id);
    if (!curriculumVerification) throw new Error('Curriculum not found');
    try {
      subjectsListToRemove.forEach(subjectId => {
        curriculumVerification.removeSubject(subjectId);
      });
      const result = await this._curriculumRepository.removeSubjects(
        id,
        subjectsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
