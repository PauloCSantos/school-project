import Event from '../../domain/entity/event.entity';

/**
 * Interface for calendar event operations.
 * Provides methods to interact with event data persistence layer.
 */
export default interface EventGateway {
  /**
   * Finds an event by its unique identifier.
   * @param id - The unique identifier of the event to search for
   * @returns Promise resolving to the found Event or undefined if not found
   */
  find(masterId: string, id: string): Promise<Event | null>;

  /**
   * Retrieves a collection of events with optional pagination.
   * @param quantity - Optional number of events to retrieve
   * @param offSet - Optional number of events to skip
   * @returns Promise resolving to an array of Event entities
   */
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<Event[]>;

  /**
   * Creates a new calendar event.
   * @param event - The event entity to be created
   * @returns Promise resolving to the unique identifier of the created event
   */
  create(masterId: string, event: Event): Promise<string>;

  /**
   * Updates an existing event.
   * @param event - The event entity with updated information
   * @returns Promise resolving to the updated Event entity
   */
  update(masterId: string, event: Event): Promise<Event>;

  /**
   * Deletes an event by its unique identifier.
   * @param id - The unique identifier of the event to delete
   * @returns Promise resolving to a success message
   */
  delete(masterId: string, id: string): Promise<string>;
}
