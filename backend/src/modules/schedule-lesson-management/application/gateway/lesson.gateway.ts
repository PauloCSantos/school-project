import Lesson from '../../domain/entity/lesson.entity';

/**
 * Interface for lesson operations.
 * Provides methods to interact with lesson data persistence layer.
 */
export default interface LessonGateway {
  /**
   * Finds a lesson by its ID.
   * @param id - The ID of the lesson to search for
   * @returns Promise resolving to the found Lesson or null if not found
   */
  find(masterId: string, id: string): Promise<Lesson | null>;

  /**
   * Retrieves a list of lessons with optional pagination.
   * @param quantity - Optional limit for the number of lessons to retrieve
   * @param offSet - Optional number of lessons to skip before starting to collect
   * @returns Promise resolving to an array of Lesson entities
   */
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<Lesson[]>;

  /**
   * Creates a new lesson.
   * @param lesson - The lesson entity to be created
   * @returns Promise resolving to the ID of the created lesson
   */
  create(masterId: string, lesson: Lesson): Promise<string>;

  /**
   * Updates an existing lesson.
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated information
   * @returns Promise resolving to the updated Lesson entity
   */
  update(masterId: string, id: string, lesson: Lesson): Promise<Lesson>;

  /**
   * Deletes a lesson by its ID.
   * @param id - The ID of the lesson to delete
   * @returns Promise resolving to a success message
   */
  delete(masterId: string, lesson: Lesson): Promise<string>;

  /**
   * Adds students to a lesson.
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated students
   * @returns Promise resolving to a success message
   */
  addStudents(masterId: string, id: string, lesson: Lesson): Promise<string>;

  /**
   * Removes students from a lesson.
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated students
   * @returns Promise resolving to a success message
   */
  removeStudents(masterId: string, id: string, lesson: Lesson): Promise<string>;

  /**
   * Adds days to a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated days
   * @returns Promise resolving to a success message
   */
  addDay(masterId: string, id: string, lesson: Lesson): Promise<string>;

  /**
   * Removes days from a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated days
   * @returns Promise resolving to a success message
   */
  removeDay(masterId: string, id: string, lesson: Lesson): Promise<string>;

  /**
   * Adds time slots to a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated times
   * @returns Promise resolving to a success message
   */
  addTime(masterId: string, id: string, lesson: Lesson): Promise<string>;

  /**
   * Removes time slots from a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated times
   * @returns Promise resolving to a success message
   */
  removeTime(masterId: string, id: string, lesson: Lesson): Promise<string>;
}
