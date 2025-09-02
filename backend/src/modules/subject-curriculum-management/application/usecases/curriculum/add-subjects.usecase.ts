import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { CurriculumNotFoundError } from '../../errors/curriculum-not-found.error';

export default class AddSubjects
  implements UseCaseInterface<AddSubjectsInputDto, AddSubjectsOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id, newSubjectsList }: AddSubjectsInputDto,
    token: TokenData
  ): Promise<AddSubjectsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.ADD,
      token
    );

    const curriculum = await this._curriculumRepository.find(token.masterId, id);
    if (!curriculum) throw new CurriculumNotFoundError(id);

    newSubjectsList.forEach(subjectId => {
      curriculum.addSubject(subjectId);
    });
    const result = await this._curriculumRepository.addSubjects(
      token.masterId,
      id,
      curriculum
    );

    return { message: result };
  }
}
