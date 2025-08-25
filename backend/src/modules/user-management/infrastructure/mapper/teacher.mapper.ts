import Teacher from '../../domain/entity/teacher.entity';
import Salary from '../../domain/@shared/value-object/salary.value-object';
import type { IFindUserTeacherOutput } from '../dto/base-teacher.dto';

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
      userId: input.userId,
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

    return new Teacher({
      id: input.id,
      userId: input.userId,
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
}
