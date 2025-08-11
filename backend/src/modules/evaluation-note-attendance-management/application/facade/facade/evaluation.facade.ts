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
import CreateEvaluation from '../../usecases/evaluation/create.usecase';
import DeleteEvaluation from '../../usecases/evaluation/delete.usecase';
import FindAllEvaluation from '../../usecases/evaluation/find-all.usecase';
import FindEvaluation from '../../usecases/evaluation/find.usecase';
import UpdateEvaluation from '../../usecases/evaluation/update.usecase';
import EvaluationFacadeInterface from '../interface/evaluation.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

/**
 * Properties required to initialize the EvaluationFacade
 */
type EvaluationFacadeProps = {
  readonly createEvaluation: CreateEvaluation;
  readonly deleteEvaluation: DeleteEvaluation;
  readonly findAllEvaluation: FindAllEvaluation;
  readonly findEvaluation: FindEvaluation;
  readonly updateEvaluation: UpdateEvaluation;
};

/**
 * Facade implementation for evaluation operations
 *
 * This class provides a unified interface to the underlying evaluation
 * use cases, simplifying client interaction with the evaluation subsystem.
 */
export default class EvaluationFacade implements EvaluationFacadeInterface {
  private readonly _createEvaluation: CreateEvaluation;
  private readonly _deleteEvaluation: DeleteEvaluation;
  private readonly _findAllEvaluation: FindAllEvaluation;
  private readonly _findEvaluation: FindEvaluation;
  private readonly _updateEvaluation: UpdateEvaluation;

  /**
   * Creates a new instance of EvaluationFacade
   * @param input Dependencies required by the facade
   */
  constructor(input: EvaluationFacadeProps) {
    this._createEvaluation = input.createEvaluation;
    this._deleteEvaluation = input.deleteEvaluation;
    this._findAllEvaluation = input.findAllEvaluation;
    this._findEvaluation = input.findEvaluation;
    this._updateEvaluation = input.updateEvaluation;
  }

  /**
   * Creates a new evaluation
   * @param input Evaluation creation parameters
   * @returns Information about the created evaluation
   */
  async create(
    input: CreateEvaluationInputDto,
    token: TokenData
  ): Promise<CreateEvaluationOutputDto> {
    return await this._createEvaluation.execute(input, token);
  }

  /**
   * Finds an evaluation by ID
   * @param input Search parameters
   * @returns Evaluation information if found, null otherwise
   */
  async find(
    input: FindEvaluationInputDto,
    token: TokenData
  ): Promise<FindEvaluationOutputDto | null> {
    // Changed from undefined to null for better semantic meaning
    const result = await this._findEvaluation.execute(input, token);
    return result || null;
  }

  /**
   * Retrieves all evaluations based on search criteria
   * @param input Search parameters
   * @returns Collection of evaluation information
   */
  async findAll(
    input: FindAllEvaluationInputDto,
    token: TokenData
  ): Promise<FindAllEvaluationOutputDto> {
    return await this._findAllEvaluation.execute(input, token);
  }

  /**
   * Deletes an evaluation
   * @param input Evaluation identification
   * @returns Confirmation message
   */
  async delete(
    input: DeleteEvaluationInputDto,
    token: TokenData
  ): Promise<DeleteEvaluationOutputDto> {
    return await this._deleteEvaluation.execute(input, token);
  }

  /**
   * Updates an evaluation's information
   * @param input Evaluation identification and data to update
   * @returns Updated evaluation information
   */
  async update(
    input: UpdateEvaluationInputDto,
    token: TokenData
  ): Promise<UpdateEvaluationOutputDto> {
    return await this._updateEvaluation.execute(input, token);
  }
}
