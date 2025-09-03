import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '../../../application/gateway/event.gateway';
import { EventMapper, EventMapperProps } from '../../mapper/event.mapper';
import { EventNotFoundError } from '@/modules/event-calendar-management/application/errors/event-not-found.error';

/**
 * In-memory implementation of EventGateway.
 * Stores and manipulates calendar events in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryEventRepository implements EventGateway {
  private _events: Map<string, Map<string, EventMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param eventsRecords - Optional initial array of events records
   * Ex.: new MemoryEventRepository([{ masterId, records: [a1, a2] }])
   */
  constructor(eventsRecords?: Array<{ masterId: string; records: Event[] }>) {
    if (eventsRecords) {
      for (const { masterId, records } of eventsRecords) {
        let events = this._events.get(masterId);
        if (!events) {
          events = new Map<string, EventMapperProps>();
          this._events.set(masterId, events);
        }
        for (const event of records) {
          events.set(event.id.value, EventMapper.toObjRepository(event));
        }
      }
    }
  }

  /**
   * Finds an event by its ID.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Event or null if not found
   */
  async find(masterId: string, id: string): Promise<Event | null> {
    const obj = this._events.get(masterId)?.get(id);
    return obj ? EventMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of events with optional pagination.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional number of events to return
   * @param offSet - Optional number of events to skip
   * @returns Promise resolving to an array of Event entities
   */
  async findAll(
    masterId: string,
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Event[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const events = this._events.get(masterId);
    if (!events) return [];
    const page = Array.from(events.values()).slice(offS, offS + qtd);

    return EventMapper.toInstanceList(page);
  }

  /**
   * Creates a new event in memory.
   * @param masterId - The tenant unique identifier
   * @param event - The event entity to be created
   * @returns Promise resolving to the ID of the created event
   */
  async create(masterId: string, event: Event): Promise<string> {
    const events = this.getOrCreateBucket(masterId);
    events.set(event.id.value, EventMapper.toObjRepository(event));
    return event.id.value;
  }

  /**
   * Updates an existing event identified by its ID.
   * @param masterId - The tenant unique identifier
   * @param event - The event entity with updated information
   * @returns Promise resolving to the updated Event entity
   * @throws Error if the event is not found
   */
  async update(masterId: string, event: Event): Promise<Event> {
    const events = this._events.get(masterId);
    if (!events || !events.has(event.id.value)) {
      throw new EventNotFoundError(event.id.value);
    }
    events.set(event.id.value, EventMapper.toObjRepository(event));
    return event;
  }

  /**
   * Deletes an event by its ID.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the event to delete
   * @returns Promise resolving to a success message
   * @throws Error if the event is not found
   */
  async delete(masterId: string, event: Event): Promise<string> {
    const events = this._events.get(masterId);
    if (!events || !events.has(event.id.value)) {
      throw new EventNotFoundError(event.id.value);
    }
    events.set(event.id.value, EventMapper.toObjRepository(event));
    return 'Operation completed successfully';
  }

  private getOrCreateBucket(masterId: string): Map<string, EventMapperProps> {
    let events = this._events.get(masterId);
    if (!events) {
      events = new Map<string, EventMapperProps>();
      this._events.set(masterId, events);
    }
    return events;
  }
}
