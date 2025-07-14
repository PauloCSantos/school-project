import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '../../gateway/evaluation.gateway';

/**
 * In-memory implementation of EvaluationGateway.
 * Stores and manipulates evaluation records in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryEvaluationRepository implements EvaluationGateway {
  private _evaluation: Evaluation[];

  /**
   * Creates a new in-memory repository.
   * @param evaluations - Optional initial array of evaluation records
   */
  constructor(evaluations?: Evaluation[]) {
    evaluations ? (this._evaluation = evaluations) : (this._evaluation = []);
  }

  /**
   * Finds an evaluation by its unique identifier.
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Evaluation or null if not found
   */
  async find(id: string): Promise<Evaluation | null> {
    const evaluation = this._evaluation.find(
      evaluation => evaluation.id.value === id
    );
    if (evaluation) {
      return evaluation;
    } else {
      return null;
    }
  }

  /**
   * Retrieves a collection of evaluations with pagination support.
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Evaluation entities
   */
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Evaluation[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const evaluations = this._evaluation.slice(offS, qtd);

    return evaluations;
  }

  /**
   * Creates a new evaluation in memory.
   * @param evaluation - The evaluation entity to be created
   * @returns Promise resolving to the unique identifier of the created evaluation
   */
  async create(evaluation: Evaluation): Promise<string> {
    this._evaluation.push(evaluation);
    return evaluation.id.value;
  }

  /**
   * Updates an existing evaluation identified by its ID.
   * @param evaluation - The evaluation entity with updated information
   * @returns Promise resolving to the updated Evaluation entity
   * @throws Error if the evaluation is not found
   */
  async update(evaluation: Evaluation): Promise<Evaluation> {
    const evaluationIndex = this._evaluation.findIndex(
      dbEvaluation => dbEvaluation.id.value === evaluation.id.value
    );
    if (evaluationIndex !== -1) {
      return (this._evaluation[evaluationIndex] = evaluation);
    } else {
      throw new Error('Evaluation not found');
    }
  }

  /**
   * Deletes an evaluation by its unique identifier.
   * @param id - The unique identifier of the evaluation to delete
   * @returns Promise resolving to a success message
   * @throws Error if the evaluation is not found
   */
  async delete(id: string): Promise<string> {
    const evaluationIndex = this._evaluation.findIndex(
      dbEvaluation => dbEvaluation.id.value === id
    );
    if (evaluationIndex !== -1) {
      this._evaluation.splice(evaluationIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Evaluation not found');
    }
  }
}
