import {
  UpdateSubjectInputDto,
  UpdateSubjectOutputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import SubjectGateway from '@/modules/subject-curriculum-management/subject/gateway/subject.gateway';

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

    name && (subject.name = name);
    description && (subject.description = description);

    const result = await this._subjectRepository.update(subject);

    return {
      name: result.name,
      description: result.description,
    };
  }
}
