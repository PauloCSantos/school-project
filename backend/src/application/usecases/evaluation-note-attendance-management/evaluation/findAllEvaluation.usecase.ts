import {
  FindAllEvaluationInputDto,
  FindAllEvaluationOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EvaluationGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/evaluation.gateway';

export default class FindAllEvaluation
  implements
    UseCaseInterface<FindAllEvaluationInputDto, FindAllEvaluationOutputDto>
{
  private _evaluationRepository: EvaluationGateway;

  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllEvaluationInputDto): Promise<FindAllEvaluationOutputDto> {
    const results = await this._evaluationRepository.findAll(offset, quantity);

    const result = results.map(evaluation => ({
      teacher: evaluation.teacher,
      lesson: evaluation.lesson,
      type: evaluation.type,
      value: evaluation.value,
    }));

    return result;
  }
}
