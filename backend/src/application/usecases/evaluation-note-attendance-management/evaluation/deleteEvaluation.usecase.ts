import {
  DeleteEvaluationInputDto,
  DeleteEvaluationOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EvaluationGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/evaluation.gateway';

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
