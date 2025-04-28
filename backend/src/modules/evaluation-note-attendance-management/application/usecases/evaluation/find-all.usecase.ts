import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllEvaluationInputDto,
  FindAllEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

/**
 * Use case responsible for retrieving all evaluation records with pagination.
 *
 * Retrieves evaluation records from the repository and maps them to the appropriate output format.
 */
export default class FindAllEvaluation
  implements
    UseCaseInterface<FindAllEvaluationInputDto, FindAllEvaluationOutputDto>
{
  /** Repository for persisting and retrieving evaluation records */
  private readonly _evaluationRepository: EvaluationGateway;

  /**
   * Constructs a new instance of the FindAllEvaluation use case.
   *
   * @param evaluationRepository - Gateway implementation for data persistence
   */
  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }

  /**
   * Executes the retrieval of all evaluation records with pagination.
   *
   * @param input - Input data containing offset and quantity for pagination
   * @returns Array of evaluation records
   */
  async execute({
    offset,
    quantity,
  }: FindAllEvaluationInputDto): Promise<FindAllEvaluationOutputDto> {
    const results = await this._evaluationRepository.findAll(offset, quantity);

    const result = results.map(evaluation => ({
      id: evaluation.id.value,
      teacher: evaluation.teacher,
      lesson: evaluation.lesson,
      type: evaluation.type,
      value: evaluation.value,
    }));

    return result;
  }
}
