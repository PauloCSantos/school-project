import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Worker from '../../domain/entity/worker.entity';
import Name from '../../domain/@shared/value-object/name.value-object';
import Address from '../../domain/@shared/value-object/address.value-object';
import Salary from '../../domain/@shared/value-object/salary.value-object';
import type { IFindUserWorkerOutput } from '../../application/dto/base-worker.dto';

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
      name: {
        fullName: input.name.fullName(),
        shortName: input.name.shortName(),
      },
      address: {
        street: input.address.street,
        city: input.address.city,
        zip: input.address.zip,
        number: input.address.number,
        avenue: input.address.avenue,
        state: input.address.state,
      },
      email: input.email,
      birthday: input.birthday,
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
    const { firstName, middleName, lastName } = this.parseName(
      input.name.fullName
    );

    return new Worker({
      id: new Id(input.id),
      name: new Name({
        firstName,
        lastName,
        middleName,
      }),
      address: new Address({
        street: input.address.street,
        city: input.address.city,
        zip: input.address.zip,
        number: input.address.number,
        avenue: input.address.avenue,
        state: input.address.state,
      }),
      email: input.email,
      birthday: input.birthday as Date,
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

  static toDTO(input: Worker): IFindUserWorkerOutput {
    if (!input || !(input instanceof Worker)) {
      throw new Error('Invalid Worker entity provided to mapper');
    }

    return {
      id: input.id.value,
      name: {
        fullName: input.name.fullName(),
        shortName: input.name.shortName(),
      },
      address: {
        street: input.address.street,
        city: input.address.city,
        zip: input.address.zip,
        number: input.address.number,
        avenue: input.address.avenue,
        state: input.address.state,
      },
      email: input.email,
      birthday: input.birthday,
      salary: input.salary.calculateTotalIncome(),
    };
  }

  static toDTOList(inputs: Worker[]): IFindUserWorkerOutput[] {
    return inputs.map(input => this.toDTO(input));
  }

  private static parseName(fullName: string): {
    firstName: string;
    lastName: string;
    middleName?: string;
  } {
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    const [firstName, ...rest] = parts;
    const lastName = rest[rest.length - 1];
    const middleName =
      rest.length > 1 ? rest.slice(0, -1).join(' ') : undefined;
    return {
      firstName,
      lastName,
      middleName,
    };
  }
}
