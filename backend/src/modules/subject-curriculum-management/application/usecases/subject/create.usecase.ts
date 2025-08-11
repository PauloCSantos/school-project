import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateSubjectInputDto,
  CreateSubjectOutputDto,
} from '../../dto/subject-usecase.dto';

import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';
import SubjectGateway from '@/modules/subject-curriculum-management/application/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class CreateSubject
  implements UseCaseInterface<CreateSubjectInputDto, CreateSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(
    subjectRepository: SubjectGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { name, description }: CreateSubjectInputDto,
    token?: TokenData
  ): Promise<CreateSubjectOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SUBJECT,
      FunctionCalledEnum.CREATE,
      token
    );

    const subject = new Subject({
      name,
      description,
    });

    const subjectVerification = await this._subjectRepository.find(
      subject.id.value
    );
    if (subjectVerification) throw new Error('Subject already exists');

    const result = await this._subjectRepository.create(subject);

    return { id: result };
  }
}
