import {
  FindEvaluationInputDto,
  FindEvaluationOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EvaluationGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/evaluation.gateway';

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
        id: response.id.id,
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
