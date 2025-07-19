import Schedule from '../../domain/entity/schedule.entity';

/**
 * Interface for schedule operations.
 * Provides methods to interact with schedule data persistence layer.
 */
export default interface ScheduleGateway {
  /**
   * Finds a schedule by its ID.
   * @param id - The ID of the schedule to search for
   * @returns Promise resolving to the found Schedule or null if not found
   */
  find(id: string): Promise<Schedule | null>;

  /**
   * Retrieves a list of schedules with optional pagination.
   * @param quantity - Optional limit for the number of schedules to retrieve
   * @param offSet - Optional number of schedules to skip before starting to collect
   * @returns Promise resolving to an array of Schedule entities
   */
  findAll(quantity?: number, offSet?: number): Promise<Schedule[]>;

  /**
   * Creates a new schedule.
   * @param schedule - The schedule entity to be created
   * @returns Promise resolving to the ID of the created schedule
   */
  create(schedule: Schedule): Promise<string>;

  /**
   * Updates an existing schedule.
   * @param schedule - The schedule entity with updated information
   * @returns Promise resolving to the updated Schedule entity
   */
  update(schedule: Schedule): Promise<Schedule>;

  /**
   * Deletes a schedule by its ID.
   * @param id - The ID of the schedule to delete
   * @returns Promise resolving to a success message
   */
  delete(id: string): Promise<string>;

  /**
   * Adds lessons to a schedule.
   * @param id - The ID of the schedule to update
   * @param newLessonsList - Array of lesson IDs to add
   * @returns Promise resolving to a success message
   */
  addLessons(id: string, newLessonsList: string[]): Promise<string>;

  /**
   * Removes lessons from a schedule.
   * @param id - The ID of the schedule to update
   * @param lessonsListToRemove - Array of lesson IDs to remove
   * @returns Promise resolving to a success message
   */
  removeLessons(id: string, lessonsListToRemove: string[]): Promise<string>;
}
