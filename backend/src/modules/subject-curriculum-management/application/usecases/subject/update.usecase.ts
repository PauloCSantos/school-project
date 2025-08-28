import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateSubjectInputDto,
  UpdateSubjectOutputDto,
} from '../../dto/subject-usecase.dto';
import SubjectGateway from '@/modules/subject-curriculum-management/application/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';

export default class UpdateSubject
  implements UseCaseInterface<UpdateSubjectInputDto, UpdateSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(
    subjectRepository: SubjectGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { id, name, description }: UpdateSubjectInputDto,
    token: TokenData
  ): Promise<UpdateSubjectOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SUBJECT,
      FunctionCalledEnum.UPDATE,
      token
    );

    const subject = await this._subjectRepository.find(token.masterId, id);
    if (!subject) throw new Error('Subject not found');

    name !== undefined && (subject.name = name);
    description !== undefined && (subject.description = description);

    if (subject.isPending) {
      subject.markVerified();
    }

    const result = await this._subjectRepository.update(token.masterId, subject);

    return {
      id: result.id.value,
      name: result.name,
      description: result.description,
    };
  }
}
