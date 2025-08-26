import { toStateType } from '@/modules/@shared/utils/formatting';
import Student from '../../domain/entity/student.entity';
import type { IFindUserStudentOutput as StudentMapperProps } from '../dto/base-student.dto';

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
      userId: input.userId,
      paymentYear: input.paymentYear,
      state: input.state,
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

    return new Student({
      id: input.id,
      userId: input.userId,
      paymentYear: input.paymentYear,
      state: toStateType(input.state),
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
}
