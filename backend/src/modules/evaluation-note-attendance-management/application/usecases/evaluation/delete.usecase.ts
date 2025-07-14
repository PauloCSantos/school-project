import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteEvaluationInputDto,
  DeleteEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

/**
 * Use case responsible for deleting an evaluation record.
 *
 * Verifies evaluation existence before proceeding with deletion.
 */
export default class DeleteEvaluation
  implements
    UseCaseInterface<DeleteEvaluationInputDto, DeleteEvaluationOutputDto>
{
  /** Repository for persisting and retrieving evaluation records */
  private readonly _evaluationRepository: EvaluationGateway;

  /**
   * Constructs a new instance of the DeleteEvaluation use case.
   *
   * @param evaluationRepository - Gateway implementation for data persistence
   */
  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }

  /**
   * Executes the deletion of an evaluation record.
   *
   * @param input - Input data containing the id of the evaluation record to delete
   * @returns Output data with the result message
   * @throws Error if the evaluation record with the specified id does not exist
   */
  async execute(
    { id }: DeleteEvaluationInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteEvaluationOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.EVALUATION,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }
    const evaluationVerification = await this._evaluationRepository.find(id);

    if (!evaluationVerification) {
      throw new Error('Evaluation not found');
    }

    const result = await this._evaluationRepository.delete(id);

    return { message: result };
  }
}
