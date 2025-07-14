import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteSubjectInputDto,
  DeleteSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class DeleteSubject
  implements UseCaseInterface<DeleteSubjectInputDto, DeleteSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { id }: DeleteSubjectInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteSubjectOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SUBJECT,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }
    const subjectVerification = await this._subjectRepository.find(id);
    if (!subjectVerification) throw new Error('Subject not found');

    const result = await this._subjectRepository.delete(id);

    return { message: result };
  }
}
