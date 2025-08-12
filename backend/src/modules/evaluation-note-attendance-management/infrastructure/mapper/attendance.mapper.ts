import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import type { IFindAttendanceOutput as AttendanceMapperProps } from '../../application/dto/base-attendance.dto';

/**
 * Interface that defines the data structure for mapping Attendance entities
 */
export type { AttendanceMapperProps };
/**
 * Mapper responsible for converting between Attendance entity and DTOs
 */
export class AttendanceMapper {
  /**
   * Converts an Attendance entity into a plain object (DTO)
   * @param input Attendance entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Attendance): AttendanceMapperProps {
    if (!input || !(input instanceof Attendance)) {
      throw new Error('Invalid Attendance entity provided to mapper');
    }

    return {
      id: input.id.value,
      date: input.date,
      day: input.day,
      hour: input.hour,
      lesson: input.lesson,
      studentsPresent: input.studentsPresent,
    };
  }

  /**
   * Converts a plain object (DTO) into an Attendance entity
   * @param input Object with Attendance properties
   * @returns Attendance instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: AttendanceMapperProps): Attendance {
    if (!input || !input.id) {
      throw new Error('Invalid attendance data provided to mapper');
    }

    return new Attendance({
      id: new Id(input.id),
      date: input.date,
      day: input.day as DayOfWeek,
      hour: input.hour as Hour,
      lesson: input.lesson,
      studentsPresent: input.studentsPresent || [],
    });
  }

  /**
   * Converts a list of Attendance entities into plain objects (DTOs)
   * @param entities List of Attendance entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Attendance[]): AttendanceMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Attendance entities
   * @param inputs List of objects with Attendance properties
   * @returns List of Attendance instances
   */
  static toInstanceList(inputs: AttendanceMapperProps[]): Attendance[] {
    return inputs.map(input => this.toInstance(input));
  }
}
