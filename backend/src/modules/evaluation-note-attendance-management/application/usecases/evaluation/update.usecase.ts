import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateEvaluationInputDto,
  UpdateEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

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
  constructor(evaluationRepository: EvaluationGateway) {
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
  async execute({
    id,
    lesson,
    teacher,
    type,
    value,
  }: UpdateEvaluationInputDto): Promise<UpdateEvaluationOutputDto> {
    const evaluation = await this._evaluationRepository.find(id);

    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    try {
      lesson !== undefined && (evaluation.lesson = lesson);
      teacher !== undefined && (evaluation.teacher = teacher);
      type !== undefined && (evaluation.type = type);
      value !== undefined && (evaluation.value = value);

      const result = await this._evaluationRepository.update(evaluation);

      return {
        id: result.id.value,
        teacher: result.teacher,
        lesson: result.lesson,
        type: result.type,
        value: result.value,
      };
    } catch (error) {
      throw error;
    }
  }
}
