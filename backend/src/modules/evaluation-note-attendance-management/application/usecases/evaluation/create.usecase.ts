import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import {
  CreateEvaluationInputDto,
  CreateEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

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
        evaluation.id.value
      );
      if (evaluationVerification) throw new Error('Evaluation already exists');

      const result = await this._evaluationRepository.create(evaluation);

      return { id: result };
    } catch (error) {
      throw error;
    }
  }
}
