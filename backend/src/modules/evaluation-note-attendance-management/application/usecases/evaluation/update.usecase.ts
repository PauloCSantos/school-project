import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateEvaluationInputDto,
  UpdateEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/application/gateway/evaluation.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { EvaluationMapper } from '@/modules/evaluation-note-attendance-management/infrastructure/mapper/evaluation.mapper';

/**
 * Use case responsible for updating an evaluation record.
 *
 * Verifies evaluation existence, applies updates, and persists changes.
 */
export default class UpdateEvaluation
  implements
    UseCaseInterface<UpdateEvaluationInputDto, UpdateEvaluationOutputDto>
{
  /** Repository for persisting and retrieving evaluation records */
  private readonly _evaluationRepository: EvaluationGateway;

  /**
   * Constructs a new instance of the UpdateEvaluation use case.
   *
   * @param evaluationRepository - Gateway implementation for data persistence
   */
  constructor(
    evaluationRepository: EvaluationGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._evaluationRepository = evaluationRepository;
  }

  /**
   * Executes the update of an evaluation record.
   *
   * @param input - Input data containing the evaluation id and fields to update
   * @returns Output data of the updated evaluation record
   * @throws Error if the evaluation record with the specified id does not exist
   * @throws ValidationError if any of the updated data fails validation
   */
  async execute(
    { id, lesson, teacher, type, value }: UpdateEvaluationInputDto,
    token: TokenData
  ): Promise<UpdateEvaluationOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.EVALUATION,
      FunctionCalledEnum.CREATE,
      token
    );
    const evaluation = await this._evaluationRepository.find(
      token.masterId,
      id
    );

    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    lesson !== undefined && (evaluation.lesson = lesson);
    teacher !== undefined && (evaluation.teacher = teacher);
    type !== undefined && (evaluation.type = type);
    value !== undefined && (evaluation.value = value);

    const result = await this._evaluationRepository.update(
      token.masterId,
      evaluation
    );

    return EvaluationMapper.toObj(result)
  }
}
