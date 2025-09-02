import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '../../../application/gateway/attendance.gateway';
import { AttendanceMapper, AttendanceMapperProps } from '../../mapper/attendance.mapper';
import { AttendanceNotFoundError } from '@/modules/evaluation-note-attendance-management/application/errors/attendance-not-found.error';

/**
 * In-memory implementation of AttendanceGateway.
 * Stores and manipulates attendance records in memory.
 */
export default class MemoryAttendanceRepository implements AttendanceGateway {
  private _attendances: Map<string, Map<string, AttendanceMapperProps>> = new Map();

  /**
 * Creates a new in-memory repository.
 * @param attendancesRecords - Optional initial array of attendance records
  Ex.: new MemoryAttendanceRepository([{ masterId, records: [a1, a2] }])
 */
  constructor(attendancesRecords?: Array<{ masterId: string; records: Attendance[] }>) {
    if (attendancesRecords) {
      for (const { masterId, records } of attendancesRecords) {
        let attendances = this._attendances.get(masterId);
        if (!attendances) {
          attendances = new Map<string, AttendanceMapperProps>();
          this._attendances.set(masterId, attendances);
        }
        for (const attendance of records) {
          attendances.set(
            attendance.id.value,
            AttendanceMapper.toObjRepository(attendance)
          );
        }
      }
    }
  }

  /**
   * Finds an attendance record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Attendance or null if not found
   */
  async find(masterId: string, id: string): Promise<Attendance | null> {
    const obj = this._attendances.get(masterId)?.get(id);
    return obj ? AttendanceMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of attendance records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Attendance entities
   */
  async findAll(
    masterId: string,
    quantity?: number,
    offSet?: number
  ): Promise<Attendance[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const attendances = this._attendances.get(masterId);
    if (!attendances) return [];
    const page = Array.from(attendances.values()).slice(offS, offS + qtd);
    return AttendanceMapper.toInstanceList(page);
  }

  /**
   * Creates a new attendance record in memory.
   * @param masterId - The tenant unique identifier
   * @param attendance - The attendance entity to be created
   * @returns Promise resolving to the created attendance id
   */
  async create(masterId: string, attendance: Attendance): Promise<string> {
    const attendances = this.getOrCreateBucket(masterId);
    attendances.set(attendance.id.value, AttendanceMapper.toObjRepository(attendance));
    return attendance.id.value;
  }

  /**
   * Updates an existing attendance.
   * @param masterId - The tenant unique identifier
   * @param attendance - The attendance entity with updated information
   * @returns Promise resolving to the updated Attendance entity
   * @throws Error if the attendance record is not found
   */
  async update(masterId: string, attendance: Attendance): Promise<Attendance> {
    const attendances = this._attendances.get(masterId);
    if (!attendances || !attendances.has(attendance.id.value)) {
      throw new AttendanceNotFoundError(attendance.id.value);
    }
    attendances.set(attendance.id.value, AttendanceMapper.toObjRepository(attendance));
    return attendance;
  }

  /**
   * Deletes an attendance record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the attendance record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the attendance record is not found
   */
  async delete(masterId: string, attendance: Attendance): Promise<string> {
    const attendances = this._attendances.get(masterId);
    if (!attendances || !attendances.has(attendance.id.value)) {
      throw new AttendanceNotFoundError(attendance.id.value);
    }
    attendances.set(attendance.id.value, AttendanceMapper.toObjRepository(attendance));
    return 'Operação concluída com sucesso';
  }

  /**
   * Adds multiple students to an existing attendance record.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the attendance record
   * @param attendance - The attendance entity with updated students
   * @returns Promise resolving to a success message indicating number of students added
   * @throws Error if the attendance record is not found or student addition fails
   */
  async addStudent(
    masterId: string,
    id: string,
    attendance: Attendance
  ): Promise<string> {
    const attendances = this._attendances.get(masterId);
    const obj = attendances?.get(id);
    if (!obj) {
      throw new AttendanceNotFoundError(id);
    }
    attendances!.set(id, AttendanceMapper.toObjRepository(attendance));
    const totalStudents = attendance.studentsPresent.length - obj.studentsPresent.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } entered`;
  }

  /**
   * Removes multiple students from an existing attendance record.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the attendance record
   * @param attendance - The attendance entity with updated students
   * @returns Promise resolving to a success message indicating number of students removed
   * @throws Error if the attendance record is not found or student removal fails
   */
  async removeStudent(
    masterId: string,
    id: string,
    attendance: Attendance
  ): Promise<string> {
    const attendances = this._attendances.get(masterId);
    const obj = attendances?.get(id);
    if (!obj) {
      throw new AttendanceNotFoundError(id);
    }

    attendances!.set(id, AttendanceMapper.toObjRepository(attendance));

    const totalStudents = obj.studentsPresent.length - attendance.studentsPresent.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } removed`;
  }

  private getOrCreateBucket(masterId: string): Map<string, AttendanceMapperProps> {
    let attendances = this._attendances.get(masterId);
    if (!attendances) {
      attendances = new Map<string, AttendanceMapperProps>();
      this._attendances.set(masterId, attendances);
    }
    return attendances;
  }
}
