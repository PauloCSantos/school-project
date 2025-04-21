import Attendance from '../../domain/entity/attendance.entity';

/**
 * Interface for attendance record operations.
 * Provides methods to interact with attendance data persistence layer.
 */
export default interface AttendanceGateway {
  /**
   * Finds an attendance record by its unique identifier.
   * @param id - The unique identifier of the attendance record to search for
   * @returns Promise resolving to the found Attendance or undefined if not found
   */
  find(id: string): Promise<Attendance | undefined>;

  /**
   * Retrieves a collection of attendance records with pagination support.
   * @param quantity - Optional limit on the number of records to return
   * @param offSet - Optional number of records to skip for pagination
   * @returns Promise resolving to an array of Attendance entities
   */
  findAll(quantity?: number, offSet?: number): Promise<Attendance[]>;

  /**
   * Creates a new attendance record.
   * @param attendance - The attendance entity to be created
   * @returns Promise resolving to the ID of the created attendance record
   */
  create(attendance: Attendance): Promise<string>;

  /**
   * Updates an existing attendance record.
   * @param attendance - The attendance entity with updated information
   * @returns Promise resolving to the updated Attendance entity
   */
  update(attendance: Attendance): Promise<Attendance>;

  /**
   * Deletes an attendance record by its unique identifier.
   * @param id - The unique identifier of the attendance record to delete
   * @returns Promise resolving to a success message
   */
  delete(id: string): Promise<string>;

  /**
   * Adds students to an existing attendance record.
   * @param id - The unique identifier of the attendance record to update
   * @param newStudentsList - Array of student IDs to be added to the attendance
   * @returns Promise resolving to a success message
   */
  addStudent(id: string, newStudentsList: string[]): Promise<string>;

  /**
   * Removes students from an existing attendance record.
   * @param id - The unique identifier of the attendance record to update
   * @param studentsListToRemove - Array of student IDs to be removed from the attendance
   * @returns Promise resolving to a success message
   */
  removeStudent(id: string, studentsListToRemove: string[]): Promise<string>;
}
