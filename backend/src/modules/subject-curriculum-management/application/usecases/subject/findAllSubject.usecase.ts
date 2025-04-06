import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllSubjectInputDto,
  FindAllSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';

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
      id: subject.id.value,
      name: subject.name,
      description: subject.description,
    }));

    return result;
  }
}
