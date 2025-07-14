import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateSubjectInputDto,
  CreateSubjectOutputDto,
} from '../../dto/subject-usecase.dto';

import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';
import SubjectGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/subject.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class CreateSubject
  implements UseCaseInterface<CreateSubjectInputDto, CreateSubjectOutputDto>
{
  private _subjectRepository: SubjectGateway;

  constructor(subjectRepository: SubjectGateway) {
    this._subjectRepository = subjectRepository;
  }
  async execute(
    { name, description }: CreateSubjectInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<CreateSubjectOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SUBJECT,
        FunctionCalledEnum.CREATE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

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
