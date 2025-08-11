import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '../../../application/gateway/attendance.gateway';

/**
 * In-memory implementation of AttendanceGateway.
 * Stores and manipulates attendance records in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryAttendanceRepository implements AttendanceGateway {
  private _attendance: Attendance[];

  /**
   * Creates a new in-memory repository.
   * @param attendances - Optional initial array of attendance records
   */
  constructor(attendances?: Attendance[]) {
    attendances ? (this._attendance = attendances) : (this._attendance = []);
  }

  /**
   * Finds an attendance record by its unique identifier.
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Attendance or null if not found
   */
  async find(id: string): Promise<Attendance | null> {
    const attendance = this._attendance.find(
      attendance => attendance.id.value === id
    );
    if (attendance) {
      return attendance;
    } else {
      return null;
    }
  }

  /**
   * Retrieves a collection of attendance records with pagination support.
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Attendance entities
   */
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Attendance[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const attendances = this._attendance.slice(offS, qtd);

    return attendances;
  }

  /**
   * Creates a new attendance record in memory.
   * @param attendance - The attendance entity to be created
   * @returns Promise resolving to the unique identifier of the created attendance record
   */
  async create(attendance: Attendance): Promise<string> {
    this._attendance.push(attendance);
    return attendance.id.value;
  }

  /**
   * Updates an existing attendance record identified by its ID.
   * @param attendance - The attendance entity with updated information
   * @returns Promise resolving to the updated Attendance entity
   * @throws Error if the attendance record is not found
   */
  async update(attendance: Attendance): Promise<Attendance> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === attendance.id.value
    );
    if (attendanceIndex !== -1) {
      return (this._attendance[attendanceIndex] = attendance);
    } else {
      throw new Error('Attendance not found');
    }
  }

  /**
   * Deletes an attendance record by its unique identifier.
   * @param id - The unique identifier of the attendance record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the attendance record is not found
   */
  async delete(id: string): Promise<string> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === id
    );
    if (attendanceIndex !== -1) {
      this._attendance.splice(attendanceIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Attendance not found');
    }
  }

  /**
   * Adds multiple students to an existing attendance record.
   * @param id - The unique identifier of the attendance record
   * @param newAttendancesList - Array of student IDs to be added to the attendance
   * @returns Promise resolving to a success message indicating number of students added
   * @throws Error if the attendance record is not found or student addition fails
   */
  async addStudent(id: string, newAttendancesList: string[]): Promise<string> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === id
    );
    if (attendanceIndex !== -1) {
      try {
        const updatedAttendance = this._attendance[attendanceIndex];
        newAttendancesList.forEach(id => {
          updatedAttendance.addStudent(id);
        });
        this._attendance[attendanceIndex] = updatedAttendance;
        return `${newAttendancesList.length} ${
          newAttendancesList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Attendance not found');
    }
  }

  /**
   * Removes multiple students from an existing attendance record.
   * @param id - The unique identifier of the attendance record
   * @param attendancesListToRemove - Array of student IDs to be removed from the attendance
   * @returns Promise resolving to a success message indicating number of students removed
   * @throws Error if the attendance record is not found or student removal fails
   */
  async removeStudent(
    id: string,
    attendancesListToRemove: string[]
  ): Promise<string> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === id
    );
    if (attendanceIndex !== -1) {
      try {
        const updatedAttendance = this._attendance[attendanceIndex];
        attendancesListToRemove.forEach(id => {
          updatedAttendance.removeStudent(id);
        });
        this._attendance[attendanceIndex] = updatedAttendance;
        return `${attendancesListToRemove.length} ${
          attendancesListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Attendance not found');
    }
  }
}
