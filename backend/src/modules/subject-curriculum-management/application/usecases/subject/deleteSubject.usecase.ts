import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteSubjectInputDto,
  DeleteSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';

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
