import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindEvaluationInputDto,
  FindEvaluationOutputDto,
} from '../../dto/evaluation-usecase.dto';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

export default class FindEvaluation
  implements
    UseCaseInterface<
      FindEvaluationInputDto,
      FindEvaluationOutputDto | undefined
    >
{
  private _evaluationRepository: EvaluationGateway;

  constructor(evaluationRepository: EvaluationGateway) {
    this._evaluationRepository = evaluationRepository;
  }
  async execute({
    id,
  }: FindEvaluationInputDto): Promise<FindEvaluationOutputDto | undefined> {
    const response = await this._evaluationRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        teacher: response.teacher,
        lesson: response.lesson,
        type: response.type,
        value: response.value,
      };
    } else {
      return response;
    }
  }
}
