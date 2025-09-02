import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteCurriculumInputDto,
  DeleteCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { CurriculumNotFoundError } from '../../errors/curriculum-not-found.error';

export default class DeleteCurriculum
  implements UseCaseInterface<DeleteCurriculumInputDto, DeleteCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id }: DeleteCurriculumInputDto,
    token: TokenData
  ): Promise<DeleteCurriculumOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.DELETE,
      token
    );

    const curriculum = await this._curriculumRepository.find(token.masterId, id);
    if (!curriculum) throw new CurriculumNotFoundError(id);
    curriculum.deactivate();

    const result = await this._curriculumRepository.delete(token.masterId, curriculum);

    return { message: result };
  }
}
