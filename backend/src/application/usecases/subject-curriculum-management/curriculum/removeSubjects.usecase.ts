import {
  RemoveSubjectsInputDto,
  RemoveSubjectsOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/infraestructure/gateway/subject-curriculum-management/curriculum.gateway';
import CurriculumMapper from '@/application/mapper/subject-curriculum-management/curriculum-usecase.mapper';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

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
    const curriculumObj = CurriculumMapper.toObj(curriculumVerification);
    const newCurriculum = JSON.parse(JSON.stringify(curriculumObj));
    const curriculum = new Curriculum({
      ...newCurriculum,
      id: new Id(newCurriculum.id),
    });
    try {
      subjectsListToRemove.forEach(subjectId => {
        curriculum.removeSubject(subjectId);
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
