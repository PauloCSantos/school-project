import {
  UpdateEvaluationInputDto,
  UpdateEvaluationOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EvaluationGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/evaluation.gateway';

export default class UpdateEvaluation
  implements
    UseCaseInterface<UpdateEvaluationInputDto, UpdateEvaluationOutputDto>
{
  private _evaluationRepository: EvaluationGateway;

  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }
  async execute({
    id,
    lesson,
    teacher,
    type,
    value,
  }: UpdateEvaluationInputDto): Promise<UpdateEvaluationOutputDto> {
    const evaluation = await this._evaluationRepository.find(id);
    if (!evaluation) throw new Error('Evaluation not found');

    try {
      lesson !== undefined && (evaluation.lesson = lesson);
      teacher !== undefined && (evaluation.teacher = teacher);
      type !== undefined && (evaluation.type = type);
      value !== undefined && (evaluation.value = value);

      const result = await this._evaluationRepository.update(evaluation);

      return {
        id: result.id.id,
        teacher: result.teacher,
        lesson: result.lesson,
        type: result.type,
        value: result.value,
      };
    } catch (error) {
      throw error;
    }
  }
}
