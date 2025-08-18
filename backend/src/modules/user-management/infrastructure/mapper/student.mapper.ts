import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Student from '../../domain/entity/student.entity';
import Name from '../../domain/@shared/value-object/name.value-object';
import Address from '../../domain/@shared/value-object/address.value-object';
import type { IFindUserStudentOutput as StudentMapperProps } from '../../application/dto/base-student.dto';

/**
 * Interface that defines the data structure for mapping Student entities
 */
export type { StudentMapperProps };

/**
 * Mapper responsible for converting between Student entity and DTOs
 */
export class StudentMapper {
  /**
   * Converts an Student entity into a plain object (DTO)
   * @param input Student entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Student): StudentMapperProps {
    if (!input || !(input instanceof Student)) {
      throw new Error('Invalid Student entity provided to mapper');
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
      paymentYear: input.paymentYear,
    };
  }

  /**
   * Converts a plain object (DTO) into an Student entity
   * @param input Object with Student properties
   * @returns Student instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: StudentMapperProps): Student {
    if (!input || !input.id) {
      throw new Error('Invalid Student data provided to mapper');
    }
    const { firstName, middleName, lastName } = this.parseName(
      input.name.fullName
    );

    return new Student({
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
      paymentYear: input.paymentYear,
    });
  }

  /**
   * Converts a list of Student entities into plain objects (DTOs)
   * @param entities List of Student entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Student[]): StudentMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Student entities
   * @param inputs List of objects with Student properties
   * @returns List of Student instances
   */
  static toInstanceList(inputs: StudentMapperProps[]): Student[] {
    return inputs.map(input => this.toInstance(input));
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
