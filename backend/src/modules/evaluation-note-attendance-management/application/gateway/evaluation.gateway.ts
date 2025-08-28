import Evaluation from '../../domain/entity/evaluation.entity';

/**
 * Interface for evaluation operations.
 * Provides methods to interact with evaluation data persistence layer.
 */
export default interface EvaluationGateway {
  /**
   * Finds an evaluation by its unique identifier.
   * @param id - The unique identifier of the evaluation to search for
   * @returns Promise resolving to the found Evaluation or null if not found
   */
  find(masterId: string, id: string): Promise<Evaluation | null>;

  /**
   * Retrieves a collection of evaluations with pagination support.
   * @param quantity - Optional limit on the number of records to return
   * @param offSet - Optional number of records to skip for pagination
   * @returns Promise resolving to an array of Evaluation entities
   */
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<Evaluation[]>;

  /**
   * Creates a new evaluation.
   * @param evaluation - The evaluation entity to be created
   * @returns Promise resolving to the ID of the created evaluation
   */
  create(masterId: string, evaluation: Evaluation): Promise<string>;

  /**
   * Updates an existing evaluation.
   * @param evaluation - The evaluation entity with updated information
   * @returns Promise resolving to the updated Evaluation entity
   */
  update(masterId: string, evaluation: Evaluation): Promise<Evaluation>;

  /**
   * Deletes an evaluation by its unique identifier.
   * @param id - The unique identifier of the evaluation to delete
   * @returns Promise resolving to a success message
   */
  delete(masterId: string, evaluation: Evaluation): Promise<string>;
}
