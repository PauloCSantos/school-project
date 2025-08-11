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
  find(id: string): Promise<Lesson | null>;

  /**
   * Retrieves a list of lessons with optional pagination.
   * @param quantity - Optional limit for the number of lessons to retrieve
   * @param offSet - Optional number of lessons to skip before starting to collect
   * @returns Promise resolving to an array of Lesson entities
   */
  findAll(quantity?: number, offSet?: number): Promise<Lesson[]>;

  /**
   * Creates a new lesson.
   * @param lesson - The lesson entity to be created
   * @returns Promise resolving to the ID of the created lesson
   */
  create(lesson: Lesson): Promise<string>;

  /**
   * Updates an existing lesson.
   * @param lesson - The lesson entity with updated information
   * @returns Promise resolving to the updated Lesson entity
   */
  update(lesson: Lesson): Promise<Lesson>;

  /**
   * Deletes a lesson by its ID.
   * @param id - The ID of the lesson to delete
   * @returns Promise resolving to a success message
   */
  delete(id: string): Promise<string>;

  /**
   * Adds students to a lesson.
   * @param id - The ID of the lesson to update
   * @param newStudentsList - Array of student IDs to add
   * @returns Promise resolving to a success message
   */
  addStudents(id: string, newStudentsList: string[]): Promise<string>;

  /**
   * Removes students from a lesson.
   * @param id - The ID of the lesson to update
   * @param studentsListToRemove - Array of student IDs to remove
   * @returns Promise resolving to a success message
   */
  removeStudents(id: string, studentsListToRemove: string[]): Promise<string>;

  /**
   * Adds days to a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param newDaysList - Array of day IDs or values to add
   * @returns Promise resolving to a success message
   */
  addDay(id: string, newDaysList: string[]): Promise<string>;

  /**
   * Removes days from a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param daysListToRemove - Array of day IDs or values to remove
   * @returns Promise resolving to a success message
   */
  removeDay(id: string, daysListToRemove: string[]): Promise<string>;

  /**
   * Adds time slots to a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param newTimesList - Array of time IDs or values to add
   * @returns Promise resolving to a success message
   */
  addTime(id: string, newTimesList: string[]): Promise<string>;

  /**
   * Removes time slots from a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param timesListToRemove - Array of time IDs or values to remove
   * @returns Promise resolving to a success message
   */
  removeTime(id: string, timesListToRemove: string[]): Promise<string>;
}
