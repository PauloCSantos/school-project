import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindSubjectInputDto,
  FindSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';

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
