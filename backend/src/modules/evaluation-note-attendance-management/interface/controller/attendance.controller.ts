import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  CreateAttendanceInputDto,
  AddStudentsInputDto,
  AddStudentsOutputDto,
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
} from '../../application/dto/attendance-usecase.dto';
import AddStudents from '../../application/usecases/attendance/add-students.usecase';
import CreateAttendance from '../../application/usecases/attendance/create.usecase';
import DeleteAttendance from '../../application/usecases/attendance/delete.usecase';
import FindAllAttendance from '../../application/usecases/attendance/find-all.usecase';
import FindAttendance from '../../application/usecases/attendance/find.usecase';
import RemoveStudents from '../../application/usecases/attendance/remove-students.usecase';
import UpdateAttendance from '../../application/usecases/attendance/update.usecase';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';

/**
 * Controller for attendance management operations.
 * Handles HTTP requests by delegating to appropriate use cases.
 */
export default class AttendanceController {
  /**
   * Creates a new AttendanceController instance.
   * @param createAttendance - Use case for creating a new attendance record
   * @param findAttendance - Use case for finding an attendance record
   * @param findAllAttendance - Use case for finding all attendance records
   * @param updateAttendance - Use case for updating an attendance record
   * @param deleteAttendance - Use case for deleting an attendance record
   * @param addStudentsToAttendance - Use case for adding students to an attendance record
   * @param removeStudentsFromAttendance - Use case for removing students from an attendance record
   */
  constructor(
    private readonly createAttendance: CreateAttendance,
    private readonly findAttendance: FindAttendance,
    private readonly findAllAttendance: FindAllAttendance,
    private readonly updateAttendance: UpdateAttendance,
    private readonly deleteAttendance: DeleteAttendance,
    private readonly addStudentsToAttendance: AddStudents,
    private readonly removeStudentsFromAttendance: RemoveStudents,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  /**
   * Creates a new attendance record.
   * @param input - The data for creating a new attendance record
   * @returns Promise resolving to the created attendance data
   */
  async create(
    input: CreateAttendanceInputDto,
    token: TokenData
  ): Promise<CreateAttendanceOutputDto> {
    const response = await this.createAttendance.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Finds an attendance record by id.
   * @param input - The input containing the id to search for
   * @returns Promise resolving to the found attendance data or null
   */
  async find(
    input: FindAttendanceInputDto,
    token: TokenData
  ): Promise<FindAttendanceOutputDto | null> {
    const response = await this.findAttendance.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Finds all attendance records based on provided criteria.
   * @param input - The criteria for finding attendance records
   * @returns Promise resolving to the found attendance records
   */
  async findAll(
    input: FindAllAttendanceInputDto,
    token: TokenData
  ): Promise<FindAllAttendanceOutputDto> {
    const response = await this.findAllAttendance.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Updates an attendance record.
   * @param input - The input containing the attendance data to update
   * @returns Promise resolving to the updated attendance data
   */
  async update(
    input: UpdateAttendanceInputDto,
    token: TokenData
  ): Promise<UpdateAttendanceOutputDto> {
    const response = await this.updateAttendance.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Deletes an attendance record.
   * @param input - The input containing the id of the attendance record to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(
    input: DeleteAttendanceInputDto,
    token: TokenData
  ): Promise<DeleteAttendanceOutputDto> {
    const response = await this.deleteAttendance.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Adds students to an attendance record.
   * @param input - The input containing the attendance record id and student ids to add
   * @returns Promise resolving to the updated attendance with added students
   */
  async addStudents(
    input: AddStudentsInputDto,
    token: TokenData
  ): Promise<AddStudentsOutputDto> {
    const response = await this.addStudentsToAttendance.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Removes students from an attendance record.
   * @param input - The input containing the attendance record id and student ids to remove
   * @returns Promise resolving to the updated attendance with removed students
   */
  async removeStudents(
    input: RemoveStudentsInputDto,
    token: TokenData
  ): Promise<RemoveStudentsOutputDto> {
    const response = await this.removeStudentsFromAttendance.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
