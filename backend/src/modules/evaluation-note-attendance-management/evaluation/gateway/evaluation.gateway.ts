import Evaluation from '../domain/entity/evaluation.entity';

export default interface EvaluationGateway {
  find(id: string): Promise<Omit<Evaluation, 'id'> | undefined>;
  findAll(
    quantity?: number,
    offSet?: number
  ): Promise<Omit<Evaluation, 'id'>[]>;
  create(evaluation: Evaluation): Promise<string>;
  update(evaluation: Evaluation): Promise<Omit<Evaluation, 'id'>>;
  delete(id: string): Promise<string>;
}
