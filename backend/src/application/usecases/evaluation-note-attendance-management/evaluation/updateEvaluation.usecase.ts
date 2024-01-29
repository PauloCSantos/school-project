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

    lesson && (evaluation.lesson = lesson);
    teacher && (evaluation.teacher = teacher);
    type && (evaluation.type = type);
    value && (evaluation.value = value);

    const result = await this._evaluationRepository.update(evaluation);

    return {
      teacher: result.teacher,
      lesson: result.lesson,
      type: result.type,
      value: result.value,
    };
  }
}
