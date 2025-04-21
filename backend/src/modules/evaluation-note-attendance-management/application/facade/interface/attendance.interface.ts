import {
  AddStudentsInputDto,
  AddStudentsOutputDto,
  CreateAttendanceInputDto,
  CreateAttendanceOutputDto,
  DeleteAttendanceInputDto,
  DeleteAttendanceOutputDto,
  FindAllAttendanceInputDto,
  FindAllAttendanceOutputDto,
  FindAttendanceInputDto,
  FindAttendanceOutputDto,
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
  UpdateAttendanceInputDto,
  UpdateAttendanceOutputDto,
} from '../../dto/attendance-facade.dto';

/**
 * Interface for attendance operations
 *
 * Provides methods for CRUD operations on attendance records
 * and student attendance management
 */
export default interface AttendanceFacadeInterface {
  /**
   * Creates a new attendance record
   * @param input Attendance creation parameters
   * @returns Information about the created attendance record
   */
  create(input: CreateAttendanceInputDto): Promise<CreateAttendanceOutputDto>;

  /**
   * Finds an attendance record by its identifier
   * @param input Search parameters
   * @returns Attendance information if found, null otherwise
   */
  find(input: FindAttendanceInputDto): Promise<FindAttendanceOutputDto | null>;

  /**
   * Retrieves all attendance records matching filter criteria
   * @param input Filter parameters
   * @returns List of attendance records
   */
  findAll(
    input: FindAllAttendanceInputDto
  ): Promise<FindAllAttendanceOutputDto>;

  /**
   * Deletes an attendance record
   * @param input Attendance identification
   * @returns Confirmation message
   */
  delete(input: DeleteAttendanceInputDto): Promise<DeleteAttendanceOutputDto>;

  /**
   * Updates an attendance record's information
   * @param input Attendance identification and data to update
   * @returns Updated attendance information
   */
  update(input: UpdateAttendanceInputDto): Promise<UpdateAttendanceOutputDto>;

  /**
   * Adds students to an attendance record
   * @param input Attendance and student identifications
   * @returns Updated attendance information with added students
   */
  addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto>;

  /**
   * Removes students from an attendance record
   * @param input Attendance and student identifications
   * @returns Updated attendance information with removed students
   */
  removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto>;
}
