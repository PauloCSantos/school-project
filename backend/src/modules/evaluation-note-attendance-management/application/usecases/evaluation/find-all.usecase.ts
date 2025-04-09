import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllEvaluationInputDto,
  FindAllEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

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
      id: evaluation.id.value,
      teacher: evaluation.teacher,
      lesson: evaluation.lesson,
      type: evaluation.type,
      value: evaluation.value,
    }));

    return result;
  }
}
