import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteAttendanceInputDto,
  DeleteAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for deleting an attendance record.
 *
 * Verifies attendance existence before proceeding with deletion.
 */
export default class DeleteAttendance
  implements
    UseCaseInterface<DeleteAttendanceInputDto, DeleteAttendanceOutputDto>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the DeleteAttendance use case.
   *
   * @param attendanceRepository - Gateway implementation for data persistence
   */
  constructor(
    attendanceRepository: AttendanceGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._attendanceRepository = attendanceRepository;
  }

  /**
   * Executes the deletion of an attendance record.
   *
   * @param input - Input data containing the id of the attendance record to delete
   * @returns Output data with the result message
   * @throws Error if the attendance record with the specified id does not exist
   */
  async execute(
    { id }: DeleteAttendanceInputDto,
    token?: TokenData
  ): Promise<DeleteAttendanceOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ATTENDANCE,
      FunctionCalledEnum.DELETE,
      token
    );

    const attendanceVerification = await this._attendanceRepository.find(id);

    if (!attendanceVerification) {
      throw new Error('Attendance not found');
    }

    const result = await this._attendanceRepository.delete(id);

    return { message: result };
  }
}
