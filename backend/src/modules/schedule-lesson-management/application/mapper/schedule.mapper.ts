import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import { FindScheduleOutputDto } from '../dto/schedule-usecase.dto';

/**
 * Interface that defines the data structure for mapping Schedule entities
 */
export interface ScheduleMapperProps extends FindScheduleOutputDto {
  id: string;
}

/**
 * Mapper responsible for converting between Schedule entity and DTOs
 */
export default class ScheduleMapper {
  /**
   * Converts a Schedule entity into a plain object (DTO)
   * @param input Schedule entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Schedule): ScheduleMapperProps {
    if (!input || !(input instanceof Schedule)) {
      throw new Error('Invalid Schedule entity provided to mapper');
    }

    return {
      id: input.id.value,
      curriculum: input.curriculum,
      lessonsList: input.lessonsList,
      student: input.student,
    };
  }

  /**
   * Converts a plain object (DTO) into a Schedule entity
   * @param input Object with Schedule properties
   * @returns Schedule instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: ScheduleMapperProps): Schedule {
    if (!input || !input.id) {
      throw new Error('Invalid schedule data provided to mapper');
    }

    return new Schedule({
      id: new Id(input.id),
      curriculum: input.curriculum,
      lessonsList: input.lessonsList || [], // Prevent null/undefined
      student: input.student,
    });
  }

  /**
   * Converts a list of Schedule entities into plain objects (DTOs)
   * @param entities List of Schedule entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Schedule[]): ScheduleMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Schedule entities
   * @param inputs List of objects with Schedule properties
   * @returns List of Schedule instances
   */
  static toInstanceList(inputs: ScheduleMapperProps[]): Schedule[] {
    return inputs.map(input => this.toInstance(input));
  }
}
