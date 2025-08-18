import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteSubjectInputDto,
  DeleteSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/application/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class DeleteSubject
  implements UseCaseInterface<DeleteSubjectInputDto, DeleteSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(
    subjectRepository: SubjectGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { id }: DeleteSubjectInputDto,
    token: TokenData
  ): Promise<DeleteSubjectOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SUBJECT,
      FunctionCalledEnum.DELETE,
      token
    );
    const subjectVerification = await this._subjectRepository.find(
      token.masterId,
      id
    );
    if (!subjectVerification) throw new Error('Subject not found');

    const result = await this._subjectRepository.delete(token.masterId, id);

    return { message: result };
  }
}
