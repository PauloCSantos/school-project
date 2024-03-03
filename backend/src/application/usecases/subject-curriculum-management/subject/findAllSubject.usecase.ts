import {
  FindAllSubjectInputDto,
  FindAllSubjectOutputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import SubjectGateway from '@/infraestructure/gateway/subject-curriculum-management/subject.gateway';

export default class FindAllSubject
  implements UseCaseInterface<FindAllSubjectInputDto, FindAllSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllSubjectInputDto): Promise<FindAllSubjectOutputDto> {
    const results = await this._subjectRepository.findAll(offset, quantity);

    const result = results.map(subject => ({
      id: subject.id.id,
      name: subject.name,
      description: subject.description,
    }));

    return result;
  }
}
