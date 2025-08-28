import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '../../domain/entity/schedule.entity';
import type { IFindScheduleOutput as ScheduleMapperProps } from '../dto/base-schedule.dto';
import { toStateType } from '@/modules/@shared/utils/formatting';

/**
 * Interface that defines the data structure for mapping Schedule entities
 */
export type { ScheduleMapperProps };
/**
 * Mapper responsible for converting between Schedule entity and DTOs
 */
export class ScheduleMapper {
  /**
   * Converts a Schedule entity into a plain object (DTO)
   * @param input Schedule entity to be converted
   * @returns Object with Schedule properties
   */
  static toObj(input: Schedule): ScheduleMapperProps {
    return {
      id: input.id.value,
      student: input.student,
      curriculum: input.curriculum,
      lessonsList: input.lessonsList,
      state: input.state,
    };
  }

  /**
   * Converts a plain object (DTO) into a Schedule entity
   * @param input Object with Schedule properties
   * @returns Schedule instance
   */
  static toInstance(input: ScheduleMapperProps): Schedule {
    return new Schedule({
      id: new Id(input.id),
      student: input.student,
      curriculum: input.curriculum,
      lessonsList: input.lessonsList,
      state: toStateType(input.state),
    });
  }

  /**
   * Converts a list of Schedule entities into a list of plain objects (DTOs)
   * @param entities List of Schedule entities to be converted
   * @returns List of objects with Schedule properties
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
