import {
  CreateEvaluationInputDto,
  CreateEvaluationOutputDto,
  DeleteEvaluationInputDto,
  DeleteEvaluationOutputDto,
  FindAllEvaluationInputDto,
  FindAllEvaluationOutputDto,
  FindEvaluationInputDto,
  FindEvaluationOutputDto,
  UpdateEvaluationInputDto,
  UpdateEvaluationOutputDto,
} from '../../dto/evaluation-facade.dto';

/**
 * Interface for evaluation operations
 *
 * Provides methods for CRUD operations on evaluations
 */
export default interface EvaluationFacadeInterface {
  /**
   * Creates a new evaluation
   * @param input Evaluation creation parameters
   * @returns Information about the created evaluation
   */
  create(input: CreateEvaluationInputDto): Promise<CreateEvaluationOutputDto>;

  /**
   * Finds an evaluation by its identifier
   * @param input Search parameters
   * @returns Evaluation information if found, null otherwise
   */
  find(input: FindEvaluationInputDto): Promise<FindEvaluationOutputDto | null>;

  /**
   * Retrieves all evaluations matching filter criteria
   * @param input Filter parameters
   * @returns List of evaluations
   */
  findAll(
    input: FindAllEvaluationInputDto
  ): Promise<FindAllEvaluationOutputDto>;

  /**
   * Deletes an evaluation
   * @param input Evaluation identification
   * @returns Confirmation message
   */
  delete(input: DeleteEvaluationInputDto): Promise<DeleteEvaluationOutputDto>;

  /**
   * Updates an evaluation's information
   * @param input Evaluation identification and data to update
   * @returns Updated evaluation information
   */
  update(input: UpdateEvaluationInputDto): Promise<UpdateEvaluationOutputDto>;
}
