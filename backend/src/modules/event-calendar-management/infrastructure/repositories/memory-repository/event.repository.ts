import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '../../gateway/event.gateway';

/**
 * In-memory implementation of EventGateway.
 * Stores and manipulates calendar events in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryEventRepository implements EventGateway {
  private _events: Event[];

  /**
   * Creates a new in-memory repository.
   * @param events - Optional initial array of calendar events
   */
  constructor(events?: Event[]) {
    events ? (this._events = events) : (this._events = []);
  }

  /**
   * Finds an event by its ID.
   * @param id - The ID to search for
   * @returns Promise resolving to the found Event or null if not found
   */
  async find(id: string): Promise<Event | null> {
    const event = this._events.find(event => event.id.value === id);
    if (event) {
      return event;
    } else {
      return null;
    }
  }

  /**
   * Retrieves a collection of events with optional pagination.
   * @param quantity - Optional number of events to return
   * @param offSet - Optional number of events to skip
   * @returns Promise resolving to an array of Event entities
   */
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Event[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const events = this._events.slice(offS, qtd);

    return events;
  }

  /**
   * Creates a new event in memory.
   * @param event - The event entity to be created
   * @returns Promise resolving to the ID of the created event
   */
  async create(event: Event): Promise<string> {
    this._events.push(event);
    return event.id.value;
  }

  /**
   * Updates an existing event identified by its ID.
   * @param event - The event entity with updated information
   * @returns Promise resolving to the updated Event entity
   * @throws Error if the event is not found
   */
  async update(event: Event): Promise<Event> {
    const eventIndex = this._events.findIndex(
      dBevent => dBevent.id.value === event.id.value
    );
    if (eventIndex !== -1) {
      return (this._events[eventIndex] = event);
    } else {
      throw new Error('Event not found');
    }
  }

  /**
   * Deletes an event by its ID.
   * @param id - The ID of the event to delete
   * @returns Promise resolving to a success message
   * @throws Error if the event is not found
   */
  async delete(id: string): Promise<string> {
    const eventIndex = this._events.findIndex(
      dBevent => dBevent.id.value === id
    );
    if (eventIndex !== -1) {
      this._events.splice(eventIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Event not found');
    }
  }
}
