import Evaluation from '../../domain/entity/evaluation.entity';

/**
 * Interface for evaluation operations.
 * Provides methods to interact with evaluation data persistence layer.
 */
export default interface EvaluationGateway {
  /**
   * Finds an evaluation by its unique identifier.
   * @param id - The unique identifier of the evaluation to search for
   * @returns Promise resolving to the found Evaluation or undefined if not found
   */
  find(id: string): Promise<Evaluation | undefined>;

  /**
   * Retrieves a collection of evaluations with pagination support.
   * @param quantity - Optional limit on the number of records to return
   * @param offSet - Optional number of records to skip for pagination
   * @returns Promise resolving to an array of Evaluation entities
   */
  findAll(quantity?: number, offSet?: number): Promise<Evaluation[]>;

  /**
   * Creates a new evaluation.
   * @param evaluation - The evaluation entity to be created
   * @returns Promise resolving to the ID of the created evaluation
   */
  create(evaluation: Evaluation): Promise<string>;

  /**
   * Updates an existing evaluation.
   * @param evaluation - The evaluation entity with updated information
   * @returns Promise resolving to the updated Evaluation entity
   */
  update(evaluation: Evaluation): Promise<Evaluation>;

  /**
   * Deletes an evaluation by its unique identifier.
   * @param id - The unique identifier of the evaluation to delete
   * @returns Promise resolving to a success message
   */
  delete(id: string): Promise<string>;
}
