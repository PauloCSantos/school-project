import {
  DeleteSubjectInputDto,
  DeleteSubjectOutputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import SubjectGateway from '@/modules/subject-curriculum-management/subject/gateway/subject.gateway';

export default class DeleteSubject
  implements UseCaseInterface<DeleteSubjectInputDto, DeleteSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute({
    id,
  }: DeleteSubjectInputDto): Promise<DeleteSubjectOutputDto> {
    const subjectVerification = await this._subjectRepository.find(id);
    if (!subjectVerification) throw new Error('Subject not found');

    const result = await this._subjectRepository.delete(id);

    return { message: result };
  }
}
