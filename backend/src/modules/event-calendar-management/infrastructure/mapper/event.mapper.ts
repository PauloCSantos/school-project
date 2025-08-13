import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Event from '../../domain/entity/event.entity';
import type { IFindEventOutput as EventMapperProps } from '../../application/dto/base-event.dto';

/**
 * Interface that defines the data structure for mapping Event entities
 */
export type { EventMapperProps };
/**
 * Mapper responsible for converting between Event entity and DTOs
 */
export class EventMapper {
  /**
   * Converts an Event entity into a plain object (DTO)
   * @param input Event entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Event): EventMapperProps {
    if (!input || !(input instanceof Event)) {
      throw new Error('Invalid Event entity provided to mapper');
    }

    return {
      id: input.id.value,
      creator: input.creator,
      name: input.name,
      date: input.date,
      hour: input.hour,
      day: input.day,
      type: input.type,
      place: input.place,
    };
  }

  /**
   * Converts a plain object (DTO) into an Event entity
   * @param input Object with Event properties
   * @returns Event instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: EventMapperProps): Event {
    if (!input || !input.id) {
      throw new Error('Invalid Event data provided to mapper');
    }

    return new Event({
        id: new Id(input.id),
        creator: input.creator,
        name: input.name,
        date: input.date,
        hour: input.hour as Hour,
        day: input.day as DayOfWeek,
        type: input.type,
        place: input.place
    });
  }

  /**
   * Converts a list of Event entities into plain objects (DTOs)
   * @param entities List of Event entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Event[]): EventMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Event entities
   * @param inputs List of objects with Event properties
   * @returns List of Event instances
   */
  static toInstanceList(inputs: EventMapperProps[]): Event[] {
    return inputs.map(input => this.toInstance(input));
  }
}
