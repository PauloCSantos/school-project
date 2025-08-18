import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Teacher from '../../domain/entity/teacher.entity';
import Name from '../../domain/@shared/value-object/name.value-object';
import Address from '../../domain/@shared/value-object/address.value-object';
import Salary from '../../domain/@shared/value-object/salary.value-object';
import type { IFindUserTeacherOutput } from '../../application/dto/base-teacher.dto';

/**
 * Interface that defines the data structure for mapping Teacher entities
 */
type Override<T, R> = Omit<T, keyof R> & R;
export type TeacherMapperProps = Override<
  IFindUserTeacherOutput,
  { salary: { salary: number; currency: 'R$' | '€' | '$' } }
>;

/**
 * Mapper responsible for converting between Teacher entity and DTOs
 */
export class TeacherMapper {
  /**
   * Converts an Teacher entity into a plain object (DTO)
   * @param input Teacher entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Teacher): TeacherMapperProps {
    if (!input || !(input instanceof Teacher)) {
      throw new Error('Invalid Teacher entity provided to mapper');
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
      graduation: input.graduation,
      academicDegrees: input.academicDegrees,
    };
  }

  /**
   * Converts a plain object (DTO) into an Teacher entity
   * @param input Object with Teacher properties
   * @returns Teacher instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: TeacherMapperProps): Teacher {
    if (!input || !input.id) {
      throw new Error('Invalid Teacher data provided to mapper');
    }
    const { firstName, middleName, lastName } = this.parseName(
      input.name.fullName
    );

    return new Teacher({
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
      graduation: input.graduation,
      academicDegrees: input.academicDegrees,
    });
  }

  /**
   * Converts a list of Teacher entities into plain objects (DTOs)
   * @param entities List of Teacher entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Teacher[]): TeacherMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Teacher entities
   * @param inputs List of objects with Teacher properties
   * @returns List of Teacher instances
   */
  static toInstanceList(inputs: TeacherMapperProps[]): Teacher[] {
    return inputs.map(input => this.toInstance(input));
  }

  static toDTO(input: Teacher): IFindUserTeacherOutput {
    if (!input || !(input instanceof Teacher)) {
      throw new Error('Invalid Teacher entity provided to mapper');
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
      graduation: input.graduation,
      academicDegrees: input.academicDegrees,
    };
  }

  static toDTOList(inputs: Teacher[]): IFindUserTeacherOutput[] {
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
