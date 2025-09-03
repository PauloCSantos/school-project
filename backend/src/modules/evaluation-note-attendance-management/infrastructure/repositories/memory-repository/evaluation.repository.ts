import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '../../../application/gateway/evaluation.gateway';
import { EvaluationMapper, EvaluationMapperProps } from '../../mapper/evaluation.mapper';
import { EvaluationNotFoundError } from '@/modules/evaluation-note-attendance-management/application/errors/evaluation-not-found.error';

/**
 * In-memory implementation of EvaluationGateway.
 * Stores and manipulates evaluation records in memory.
 */
export default class MemoryEvaluationRepository implements EvaluationGateway {
  private _evaluations: Map<string, Map<string, EvaluationMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param evaluationsRecords - Optional initial grouped array of evaluation records
   * Ex.: new MemoryEvaluationRepository([{ masterId, records: [e1, e2] }])
   */
  constructor(evaluationsRecords?: Array<{ masterId: string; records: Evaluation[] }>) {
    if (evaluationsRecords?.length) {
      for (const { masterId, records } of evaluationsRecords) {
        const evaluations = this.getOrCreateBucket(masterId);
        for (const evaluation of records) {
          evaluations.set(
            evaluation.id.value,
            EvaluationMapper.toObjRepository(evaluation)
          );
        }
      }
    }
  }

  /**
   * Finds an evaluation by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Evaluation or null if not found
   */
  async find(masterId: string, id: string): Promise<Evaluation | null> {
    const obj = this._evaluations.get(masterId)?.get(id);
    return obj ? EvaluationMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of evaluations records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Evaluation entities
   */
  async findAll(
    masterId: string,
    quantity?: number,
    offSet?: number
  ): Promise<Evaluation[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const evaluations = this._evaluations.get(masterId);
    if (!evaluations) return [];
    const page = Array.from(evaluations.values()).slice(offS, offS + qtd);
    return EvaluationMapper.toInstanceList(page);
  }

  /**
   * Creates a new evaluation record in memory.
   * @param masterId - The tenant unique identifier
   * @param evaluation - The evaluation entity to be created
   * @returns Promise resolving to the created evaluation id
   */
  async create(masterId: string, evaluation: Evaluation): Promise<string> {
    const evaluations = this.getOrCreateBucket(masterId);
    evaluations.set(evaluation.id.value, EvaluationMapper.toObjRepository(evaluation));
    return evaluation.id.value;
  }

  /**
   * Updates an existing evaluation.
   * @param masterId - The tenant unique identifier
   * @param evaluation - The evaluation entity with updated values
   * @returns Promise resolving to the updated Evaluation entity
   * @throws Error if the evaluation is not found
   */
  async update(masterId: string, evaluation: Evaluation): Promise<Evaluation> {
    const evaluations = this._evaluations.get(masterId);
    if (!evaluations || !evaluations.has(evaluation.id.value)) {
      throw new EvaluationNotFoundError(evaluation.id.value);
    }
    evaluations.set(evaluation.id.value, EvaluationMapper.toObjRepository(evaluation));
    return evaluation;
  }

  /**
   * Deletes an evaluation by id
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to delete
   * @returns Promise resolving to a success message
   * @throws Error if the evaluation is not found
   */
  async delete(masterId: string, evaluation: Evaluation): Promise<string> {
    const evaluations = this._evaluations.get(masterId);
    if (!evaluations || !evaluations.has(evaluation.id.value)) {
      throw new EvaluationNotFoundError(evaluation.id.value);
    }
    evaluations.set(evaluation.id.value, EvaluationMapper.toObjRepository(evaluation));
    return 'Operation completed successfully';
  }

  private getOrCreateBucket(masterId: string): Map<string, EvaluationMapperProps> {
    let evaluations = this._evaluations.get(masterId);
    if (!evaluations) {
      evaluations = new Map<string, EvaluationMapperProps>();
      this._evaluations.set(masterId, evaluations);
    }
    return evaluations;
  }
}
