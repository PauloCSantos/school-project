import {
  FindSubjectInputDto,
  FindSubjectOutputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import SubjectGateway from '@/infraestructure/gateway/subject-curriculum-management/subject.gateway';

export default class FindSubject
  implements
    UseCaseInterface<FindSubjectInputDto, FindSubjectOutputDto | undefined>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute({
    id,
  }: FindSubjectInputDto): Promise<FindSubjectOutputDto | undefined> {
    const response = await this._subjectRepository.find(id);
    if (response) {
      return {
        id: response.id.id,
        name: response.name,
        description: response.description,
      };
    } else {
      return response;
    }
  }
}
