import {
  UpdateSubjectInputDto,
  UpdateSubjectOutputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import SubjectGateway from '@/infraestructure/gateway/subject-curriculum-management/subject.gateway';

export default class UpdateSubject
  implements UseCaseInterface<UpdateSubjectInputDto, UpdateSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute({
    id,
    name,
    description,
  }: UpdateSubjectInputDto): Promise<UpdateSubjectOutputDto> {
    const subject = await this._subjectRepository.find(id);
    if (!subject) throw new Error('Subject not found');

    try {
      name !== undefined && (subject.name = name);
      description !== undefined && (subject.description = description);

      const result = await this._subjectRepository.update(subject);

      return {
        id: result.id.id,
        name: result.name,
        description: result.description,
      };
    } catch (error) {
      throw error;
    }
  }
}
