import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
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
} from '../../application/dto/evaluation-usecase.dto';
import CreateEvaluation from '../../application/usecases/evaluation/create.usecase';
import DeleteEvaluation from '../../application/usecases/evaluation/delete.usecase';
import FindAllEvaluation from '../../application/usecases/evaluation/find-all.usecase';
import FindEvaluation from '../../application/usecases/evaluation/find.usecase';
import UpdateEvaluation from '../../application/usecases/evaluation/update.usecase';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

/**
 * Controller for evaluation management operations.
 * Handles HTTP requests by delegating to appropriate use cases.
 */
export default class EvaluationController {
  /**
   * Creates a new EvaluationController instance.
   * @param createEvaluation - Use case for creating a new evaluation
   * @param findEvaluation - Use case for finding an evaluation
   * @param findAllEvaluation - Use case for finding all evaluations
   * @param updateEvaluation - Use case for updating an evaluation
   * @param deleteEvaluation - Use case for deleting an evaluation
   */
  constructor(
    private readonly createEvaluation: CreateEvaluation,
    private readonly findEvaluation: FindEvaluation,
    private readonly findAllEvaluation: FindAllEvaluation,
    private readonly updateEvaluation: UpdateEvaluation,
    private readonly deleteEvaluation: DeleteEvaluation,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  /**
   * Creates a new evaluation.
   * @param input - The data for creating a new evaluation
   * @returns Promise resolving to the created evaluation data
   */
  async create(
    input: CreateEvaluationInputDto,
    token: TokenData
  ): Promise<CreateEvaluationOutputDto> {
    const response = await this.createEvaluation.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Finds an evaluation by id.
   * @param input - The input containing the id to search for
   * @returns Promise resolving to the found evaluation data or null
   */
  async find(
    input: FindEvaluationInputDto,
    token: TokenData
  ): Promise<FindEvaluationOutputDto | null> {
    const response = await this.findEvaluation.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Finds all evaluations based on provided criteria.
   * @param input - The criteria for finding evaluations
   * @returns Promise resolving to the found evaluation records
   */
  async findAll(
    input: FindAllEvaluationInputDto,
    token: TokenData
  ): Promise<FindAllEvaluationOutputDto> {
    const response = await this.findAllEvaluation.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Updates an evaluation.
   * @param input - The input containing the evaluation data to update
   * @returns Promise resolving to the updated evaluation data
   */
  async update(
    input: UpdateEvaluationInputDto,
    token: TokenData
  ): Promise<UpdateEvaluationOutputDto> {
    const response = await this.updateEvaluation.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Deletes an evaluation.
   * @param input - The input containing the id of the evaluation to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(
    input: DeleteEvaluationInputDto,
    token: TokenData
  ): Promise<DeleteEvaluationOutputDto> {
    const response = await this.deleteEvaluation.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
