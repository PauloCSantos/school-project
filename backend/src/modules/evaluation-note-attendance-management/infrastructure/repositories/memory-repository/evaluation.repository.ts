import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '../../gateway/evaluation.gateway';

export default class MemoryEvaluationRepository implements EvaluationGateway {
  private _evaluation: Evaluation[];

  constructor(evaluations?: Evaluation[]) {
    evaluations ? (this._evaluation = evaluations) : (this._evaluation = []);
  }

  async find(id: string): Promise<Evaluation | undefined> {
    const evaluation = this._evaluation.find(
      evaluation => evaluation.id.value === id
    );
    if (evaluation) {
      return evaluation;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Evaluation[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const evaluations = this._evaluation.slice(offS, qtd);

    return evaluations;
  }
  async create(evaluation: Evaluation): Promise<string> {
    this._evaluation.push(evaluation);
    return evaluation.id.value;
  }
  async update(evaluation: Evaluation): Promise<Evaluation> {
    const evaluationIndex = this._evaluation.findIndex(
      dbEvaluation => dbEvaluation.id.value === evaluation.id.value
    );
    if (evaluationIndex !== -1) {
      return (this._evaluation[evaluationIndex] = evaluation);
    } else {
      throw new Error('Evaluation not found');
    }
  }
  async delete(id: string): Promise<string> {
    const evaluationIndex = this._evaluation.findIndex(
      dbEvaluation => dbEvaluation.id.value === id
    );
    if (evaluationIndex !== -1) {
      this._evaluation.splice(evaluationIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Evaluation not found');
    }
  }
}
