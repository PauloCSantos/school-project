import Attendance from '../../domain/entity/attendance.entity';

/**
 * Interface for attendance record operations.
 * Provides methods to interact with attendance data persistence layer.
 */
export default interface AttendanceGateway {
  /**
   * Finds an attendance record by its unique identifier.
   * @param id - The unique identifier of the attendance record to search for
   * @returns Promise resolving to the found Attendance or null if not found
   */
  find(masterId: string, id: string): Promise<Attendance | null>;

  /**
   * Retrieves a collection of attendance records with pagination support.
   * @param quantity - Optional limit on the number of records to return
   * @param offSet - Optional number of records to skip for pagination
   * @returns Promise resolving to an array of Attendance entities
   */
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<Attendance[]>;

  /**
   * Creates a new attendance record.
   * @param attendance - The attendance entity to be created
   * @returns Promise resolving to the ID of the created attendance record
   */
  create(masterId: string, attendance: Attendance): Promise<string>;

  /**
   * Updates an existing attendance record.
   * @param attendance - The attendance entity with updated information
   * @returns Promise resolving to the updated Attendance entity
   */
  update(masterId: string, attendance: Attendance): Promise<Attendance>;

  /**
   * Deletes an attendance record by its unique identifier.
   * @param id - The unique identifier of the attendance record to delete
   * @returns Promise resolving to a success message
   */
  delete(masterId: string, attendance: Attendance): Promise<string>;

  /**
   * Adds students to an existing attendance record.
   * @param id - The unique identifier of the attendance record to update
   * @param attendance - The attendance entity with updated students
   * @returns Promise resolving to a success message
   */
  addStudent(masterId: string, id: string, attendance: Attendance): Promise<string>;

  /**
   * Removes students from an existing attendance record.
   * @param id - The unique identifier of the attendance record to update
   * @param attendance - The attendance entity with updated students
   * @returns Promise resolving to a success message
   */
  removeStudent(masterId: string, id: string, attendance: Attendance): Promise<string>;
}
