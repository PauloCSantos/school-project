import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindEvaluationInputDto,
  FindEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

/**
 * Use case responsible for finding an evaluation record by id.
 *
 * Retrieves evaluation information from the repository and maps it to the appropriate output format.
 */
export default class FindEvaluation
  implements
    UseCaseInterface<
      FindEvaluationInputDto,
      FindEvaluationOutputDto | undefined
    >
{
  /** Repository for persisting and retrieving evaluation records */
  private readonly _evaluationRepository: EvaluationGateway;

  /**
   * Constructs a new instance of the FindEvaluation use case.
   *
   * @param evaluationRepository - Gateway implementation for data persistence
   */
  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }

  /**
   * Executes the search for an evaluation record by id.
   *
   * @param input - Input data containing the id to search for
   * @returns Evaluation data if found, undefined otherwise
   */
  async execute({
    id,
  }: FindEvaluationInputDto): Promise<FindEvaluationOutputDto | undefined> {
    const response = await this._evaluationRepository.find(id);

    if (response) {
      return {
        id: response.id.value,
        teacher: response.teacher,
        lesson: response.lesson,
        type: response.type,
        value: response.value,
      };
    }

    return undefined;
  }
}
