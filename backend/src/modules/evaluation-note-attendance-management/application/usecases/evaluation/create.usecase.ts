import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import {
  CreateEvaluationInputDto,
  CreateEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

/**
 * Use case responsible for creating a new evaluation record.
 *
 * Checks for evaluation uniqueness and persists the record in the repository.
 */
export default class CreateEvaluation
  implements
    UseCaseInterface<CreateEvaluationInputDto, CreateEvaluationOutputDto>
{
  /** Repository for persisting and retrieving evaluation records */
  private readonly _evaluationRepository: EvaluationGateway;

  /**
   * Constructs a new instance of the CreateEvaluation use case.
   *
   * @param evaluationRepository - Gateway implementation for data persistence
   */
  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }

  /**
   * Executes the creation of a new evaluation record.
   *
   * @param input - Input data including lesson, teacher, type, and value
   * @returns Output data with the id of the created evaluation record
   * @throws Error if an evaluation record with the same id already exists
   * @throws ValidationError if any of the input data fails validation during entity creation
   */
  async execute({
    lesson,
    teacher,
    type,
    value,
  }: CreateEvaluationInputDto): Promise<CreateEvaluationOutputDto> {
    try {
      const evaluation = new Evaluation({
        lesson,
        teacher,
        type,
        value,
      });

      const evaluationVerification = await this._evaluationRepository.find(
        evaluation.id.value
      );

      if (evaluationVerification) {
        throw new Error('Evaluation already exists');
      }

      const result = await this._evaluationRepository.create(evaluation);

      return { id: result };
    } catch (error) {
      throw error;
    }
  }
}
