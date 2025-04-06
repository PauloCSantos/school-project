import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateSubjectInputDto,
  CreateSubjectOutputDto,
} from '../../dto/subject-usecase.dto';

import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';

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
