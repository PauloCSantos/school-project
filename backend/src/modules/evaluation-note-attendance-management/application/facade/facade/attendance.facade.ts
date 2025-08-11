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
import AddStudents from '../../usecases/attendance/add-students.usecase';
import CreateAttendance from '../../usecases/attendance/create.usecase';
import DeleteAttendance from '../../usecases/attendance/delete.usecase';
import FindAllAttendance from '../../usecases/attendance/find-all.usecase';
import FindAttendance from '../../usecases/attendance/find.usecase';
import RemoveStudents from '../../usecases/attendance/remove-students.usecase';
import UpdateAttendance from '../../usecases/attendance/update.usecase';
import AttendanceFacadeInterface from '../interface/attendance.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

/**
 * Properties required to initialize the AttendanceFacade
 */
type AttendanceFacadeProps = {
  readonly createAttendance: CreateAttendance;
  readonly deleteAttendance: DeleteAttendance;
  readonly findAllAttendance: FindAllAttendance;
  readonly findAttendance: FindAttendance;
  readonly updateAttendance: UpdateAttendance;
  readonly addStudents: AddStudents;
  readonly removeStudents: RemoveStudents;
};

/**
 * Facade implementation for attendance operations
 *
 * This class provides a unified interface to the underlying attendance
 * use cases, simplifying client interaction with the attendance subsystem.
 */
export default class AttendanceFacade implements AttendanceFacadeInterface {
  private readonly _createAttendance: CreateAttendance;
  private readonly _deleteAttendance: DeleteAttendance;
  private readonly _findAllAttendance: FindAllAttendance;
  private readonly _findAttendance: FindAttendance;
  private readonly _updateAttendance: UpdateAttendance;
  private readonly _addStudents: AddStudents;
  private readonly _removeStudents: RemoveStudents;

  /**
   * Creates a new instance of AttendanceFacade
   * @param input Dependencies required by the facade
   */
  constructor(input: AttendanceFacadeProps) {
    this._createAttendance = input.createAttendance;
    this._deleteAttendance = input.deleteAttendance;
    this._findAllAttendance = input.findAllAttendance;
    this._findAttendance = input.findAttendance;
    this._updateAttendance = input.updateAttendance;
    this._addStudents = input.addStudents;
    this._removeStudents = input.removeStudents;
  }

  /**
   * Creates a new attendance record
   * @param input Attendance creation parameters
   * @returns Information about the created attendance record
   */
  async create(
    input: CreateAttendanceInputDto,
    token: TokenData
  ): Promise<CreateAttendanceOutputDto> {
    return await this._createAttendance.execute(input, token);
  }

  /**
   * Finds an attendance record by ID
   * @param input Search parameters
   * @returns Attendance information if found, null otherwise
   */
  async find(
    input: FindAttendanceInputDto,
    token: TokenData
  ): Promise<FindAttendanceOutputDto | null> {
    // Changed from undefined to null for better semantic meaning
    const result = await this._findAttendance.execute(input, token);
    return result || null;
  }

  /**
   * Retrieves all attendance records based on search criteria
   * @param input Search parameters
   * @returns Collection of attendance information
   */
  async findAll(
    input: FindAllAttendanceInputDto,
    token: TokenData
  ): Promise<FindAllAttendanceOutputDto> {
    return await this._findAllAttendance.execute(input, token);
  }

  /**
   * Deletes an attendance record
   * @param input Attendance identification
   * @returns Confirmation message
   */
  async delete(
    input: DeleteAttendanceInputDto,
    token: TokenData
  ): Promise<DeleteAttendanceOutputDto> {
    return await this._deleteAttendance.execute(input, token);
  }

  /**
   * Updates an attendance record's information
   * @param input Attendance identification and data to update
   * @returns Updated attendance information
   */
  async update(
    input: UpdateAttendanceInputDto,
    token: TokenData
  ): Promise<UpdateAttendanceOutputDto> {
    return await this._updateAttendance.execute(input, token);
  }

  /**
   * Adds students to an attendance record
   * @param input Attendance ID and student IDs to add
   * @returns Updated attendance information
   */
  async addStudents(
    input: AddStudentsInputDto,
    token: TokenData
  ): Promise<AddStudentsOutputDto> {
    return await this._addStudents.execute(input, token);
  }

  /**
   * Removes students from an attendance record
   * @param input Attendance ID and student IDs to remove
   * @returns Updated attendance information
   */
  async removeStudents(
    input: RemoveStudentsInputDto,
    token: TokenData
  ): Promise<RemoveStudentsOutputDto> {
    return await this._removeStudents.execute(input, token);
  }
}
