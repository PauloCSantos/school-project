import Evaluation from '../domain/entity/evaluation.entity';

export default interface EvaluationGateway {
  find(id: string): Promise<Evaluation | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Evaluation[]>;
  create(evaluation: Evaluation): Promise<string>;
  update(evaluation: Evaluation): Promise<Evaluation>;
  delete(id: string): Promise<string>;
}
