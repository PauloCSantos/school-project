import Worker from '../../domain/entity/worker.entity';
import { UserBase } from '../../domain/entity/user.entity';
import { IFindUserWorkerOutput as WorkerAssemblerProps } from '../dto/base-worker.dto';

/**
 * Interface that defines the data structure for mapping Worker entities
 */
export type { WorkerAssemblerProps };

/**
 * Mapper responsible for converting between Worker entity and DTOs
 */
export class WorkerAssembler {
  /**
   * Converts an Worker entity into a plain object (DTO)
   * @param user Worker entity to be converted
   * @param worker Worker entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(user: UserBase, worker: Worker): WorkerAssemblerProps {
    return {
      id: worker.id.value,
      name: {
        fullName: user.name.fullName(),
        shortName: user.name.shortName(),
      },
      address: {
        street: user.address.street,
        city: user.address.city,
        zip: user.address.zip,
        number: user.address.number,
        avenue: user.address.avenue,
        state: user.address.state,
      },
      email: user.email,
      birthday: user.birthday,
      salary: worker.salary.calculateTotalIncome(),
    };
  }

  static toObjList(
    results: readonly { entity: Worker; user: UserBase }[]
  ): WorkerAssemblerProps[] {
    return results.map(({ entity, user }) => this.toObj(user, entity));
  }
}
