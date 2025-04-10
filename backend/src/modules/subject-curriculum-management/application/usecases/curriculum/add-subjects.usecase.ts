import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';
import CurriculumMapper from '../../mapper/curriculum.mapper';

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
    const curriculumObj = CurriculumMapper.toObj(curriculumVerification);
    const newCurriculum = JSON.parse(JSON.stringify(curriculumObj));
    const curriculum = new Curriculum({
      ...newCurriculum,
      id: new Id(newCurriculum.id),
    });
    try {
      newSubjectsList.forEach(subjectId => {
        curriculum.addSubject(subjectId);
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
