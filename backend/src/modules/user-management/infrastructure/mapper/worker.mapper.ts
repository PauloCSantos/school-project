import Worker from '../../domain/entity/worker.entity';
import Salary from '../../domain/@shared/value-object/salary.value-object';
import type { IFindUserWorkerOutput } from '../dto/base-worker.dto';

/**
 * Interface that defines the data structure for mapping Worker entities
 */
type Override<T, R> = Omit<T, keyof R> & R;
export type WorkerMapperProps = Override<
  IFindUserWorkerOutput,
  { salary: { salary: number; currency: 'R$' | '€' | '$' } }
>;

/**
 * Mapper responsible for converting between Worker entity and DTOs
 */
export class WorkerMapper {
  /**
   * Converts an Worker entity into a plain object (DTO)
   * @param input Worker entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Worker): WorkerMapperProps {
    if (!input || !(input instanceof Worker)) {
      throw new Error('Invalid Worker entity provided to mapper');
    }

    return {
      id: input.id.value,
      userId: input.userId,
      salary: { salary: input.salary.salary, currency: input.salary.currency },
    };
  }

  /**
   * Converts a plain object (DTO) into an Worker entity
   * @param input Object with Worker properties
   * @returns Worker instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: WorkerMapperProps): Worker {
    if (!input || !input.id) {
      throw new Error('Invalid Worker data provided to mapper');
    }

    return new Worker({
      id: input.id,
      userId: input.userId,
      salary: new Salary({
        salary: input.salary.salary,
        currency: input.salary.currency,
      }),
    });
  }

  /**
   * Converts a list of Worker entities into plain objects (DTOs)
   * @param entities List of Worker entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Worker[]): WorkerMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Worker entities
   * @param inputs List of objects with Worker properties
   * @returns List of Worker instances
   */
  static toInstanceList(inputs: WorkerMapperProps[]): Worker[] {
    return inputs.map(input => this.toInstance(input));
  }
}
