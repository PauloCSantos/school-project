import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '../../domain/entity/lesson.entity';
import type { IFindLessonOutput as LessonMapperProps } from '../../application/dto/base-lesson.dto';

/**
 * Interface that defines the data structure for mapping Lesson entities
 */
export type { LessonMapperProps };
/**
 * Mapper responsible for converting between Lesson entity and DTOs
 */
export class LessonMapper {
  /**
   * Converts a Lesson entity into a plain object (DTO)
   * @param input Lesson entity to be converted
   * @returns Object with Lesson properties
   */
  static toObj(input: Lesson): LessonMapperProps {
    if (!input || !(input instanceof Lesson)) {
      throw new Error('Invalid Lesson entity provided to mapper');
    }
    return {
      id: input.id.value,
      name: input.name,
      duration: input.duration,
      teacher: input.teacher,
      studentsList: input.studentsList,
      subject: input.subject,
      days: input.days,
      times: input.times,
      semester: input.semester,
    };
  }

  /**
   * Converts a plain object (DTO) into a Lesson entity
   * @param input Object with Lesson properties
   * @returns Lesson instance
   */
  static toInstance(input: LessonMapperProps): Lesson {
    return new Lesson({
      id: new Id(input.id),
      name: input.name,
      duration: input.duration,
      teacher: input.teacher,
      studentsList: input.studentsList,
      subject: input.subject,
      days: input.days as DayOfWeek[],
      times: input.times as Hour[],
      semester: input.semester as 1 | 2,
    });
  }

  /**
   * Converts a list of Lesson entities into a list of plain objects (DTOs)
   * @param entities List of Lesson entities to be converted
   * @returns List of objects with Lesson properties
   */
  static toObjList(entities: Lesson[]): LessonMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Lesson entities
   * @param inputs List of objects with Lesson properties
   * @returns List of Lesson instances
   */
  static toInstanceList(inputs: LessonMapperProps[]): Lesson[] {
    return inputs.map(input => this.toInstance(input));
  }
}
