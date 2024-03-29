import {
  CreateEvaluationInputDto,
  CreateEvaluationOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EvaluationGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/evaluation.gateway';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';

export default class CreateEvaluation
  implements
    UseCaseInterface<CreateEvaluationInputDto, CreateEvaluationOutputDto>
{
  private _evaluationRepository: EvaluationGateway;

  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }
  async execute({
    lesson,
    teacher,
    type,
    value,
  }: CreateEvaluationInputDto): Promise<CreateEvaluationOutputDto> {
    try {
      const evaluation = new Evaluation({
        lesson,
        teacher,
        type,
        value,
      });

      const evaluationVerification = await this._evaluationRepository.find(
        evaluation.id.id
      );
      if (evaluationVerification) throw new Error('Evaluation already exists');

      const result = await this._evaluationRepository.create(evaluation);

      return { id: result };
    } catch (error) {
      throw error;
    }
  }
}
