import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import { FindLessonOutputDto } from '../dto/lesson-usecase.dto';

/**
 * Interface that defines the data structure for mapping Lesson entities
 */
export interface LessonMapperProps extends FindLessonOutputDto {
  id: string;
}

/**
 * Mapper responsible for converting between Lesson entity and DTOs
 */
export default class LessonMapper {
  /**
   * Converts a Lesson entity into a plain object (DTO)
   * @param input Lesson entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Lesson): LessonMapperProps {
    if (!input || !(input instanceof Lesson)) {
      throw new Error('Invalid Lesson entity provided to mapper');
    }

    return {
      id: input.id.value,
      days: input.days,
      duration: input.duration,
      name: input.name,
      semester: input.semester,
      studentsList: input.studentsList,
      subject: input.subject,
      teacher: input.teacher,
      times: input.times,
    };
  }

  /**
   * Converts a plain object (DTO) into a Lesson entity
   * @param input Object with Lesson properties
   * @returns Lesson instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: LessonMapperProps): Lesson {
    if (!input || !input.id) {
      throw new Error('Invalid lesson data provided to mapper');
    }

    return new Lesson({
      id: new Id(input.id),
      days: input.days as DayOfWeek[],
      duration: input.duration,
      name: input.name,
      semester: input.semester as 1 | 2,
      studentsList: input.studentsList || [], // Prevent null/undefined
      subject: input.subject,
      teacher: input.teacher,
      times: input.times as Hour[],
    });
  }

  /**
   * Converts a list of Lesson entities into plain objects (DTOs)
   * @param entities List of Lesson entities
   * @returns List of plain objects representing the entities
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
