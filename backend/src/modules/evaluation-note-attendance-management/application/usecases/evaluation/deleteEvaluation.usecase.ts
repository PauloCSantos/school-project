import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteEvaluationInputDto,
  DeleteEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

export default class DeleteEvaluation
  implements
    UseCaseInterface<DeleteEvaluationInputDto, DeleteEvaluationOutputDto>
{
  private _evaluationRepository: EvaluationGateway;

  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }
  async execute({
    id,
  }: DeleteEvaluationInputDto): Promise<DeleteEvaluationOutputDto> {
    const evaluationVerification = await this._evaluationRepository.find(id);
    if (!evaluationVerification) throw new Error('Evaluation not found');

    const result = await this._evaluationRepository.delete(id);

    return { message: result };
  }
}
