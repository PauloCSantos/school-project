import {
  CreateSubjectInputDto,
  CreateSubjectOutputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import SubjectGateway from '@/modules/subject-curriculum-management/subject/gateway/subject.gateway';
import Subject from '@/modules/subject-curriculum-management/subject/domain/entity/subject.entity';

export default class CreateSubject
  implements UseCaseInterface<CreateSubjectInputDto, CreateSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute({
    name,
    description,
  }: CreateSubjectInputDto): Promise<CreateSubjectOutputDto> {
    const subject = new Subject({
      name,
      description,
    });

    const subjectVerification = await this._subjectRepository.find(
      subject.id.id
    );
    if (subjectVerification) throw new Error('Subject already exists');

    const result = await this._subjectRepository.create(subject);

    return { id: result };
  }
}
