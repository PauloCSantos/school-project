import {
  RemoveSubjectsInputDto,
  RemoveSubjectsOutputDto,
} from '../../dto/curriculum-usecase.dto';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { CurriculumNotFoundError } from '../../errors/curriculum-not-found.error';

export default class RemoveSubjects
  implements UseCaseInterface<RemoveSubjectsInputDto, RemoveSubjectsOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id, subjectsListToRemove }: RemoveSubjectsInputDto,
    token: TokenData
  ): Promise<RemoveSubjectsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.REMOVE,
      token
    );

    const curriculum = await this._curriculumRepository.find(token.masterId, id);
    if (!curriculum) throw new CurriculumNotFoundError(id);

    subjectsListToRemove.forEach(subjectId => {
      curriculum.removeSubject(subjectId);
    });
    const result = await this._curriculumRepository.removeSubjects(
      token.masterId,
      id,
      curriculum
    );

    return { message: result };
  }
}
