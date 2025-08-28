import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateAttendanceInputDto,
  UpdateAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { AttendanceMapper } from '@/modules/evaluation-note-attendance-management/infrastructure/mapper/attendance.mapper';

/**
 * Use case responsible for updating an attendance record.
 *
 * Verifies attendance existence, applies updates, and persists changes.
 */
export default class UpdateAttendance
  implements UseCaseInterface<UpdateAttendanceInputDto, UpdateAttendanceOutputDto>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the UpdateAttendance use case.
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
   * Executes the update of an attendance record.
   *
   * @param input - Input data containing the attendance id and fields to update
   * @returns Output data of the updated attendance record
   * @throws Error if the attendance record with the specified id does not exist
   * @throws ValidationError if any of the updated data fails validation
   */
  async execute(
    { id, date, day, hour, lesson }: UpdateAttendanceInputDto,
    token: TokenData
  ): Promise<UpdateAttendanceOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ATTENDANCE,
      FunctionCalledEnum.UPDATE,
      token
    );

    const attendance = await this._attendanceRepository.find(token.masterId, id);

    if (!attendance) {
      throw new Error('Attendance not found');
    }

    date !== undefined && (attendance.date = date);
    day !== undefined && (attendance.day = day);
    hour !== undefined && (attendance.hour = hour);
    lesson !== undefined && (attendance.lesson = lesson);

    if (attendance.isPending) {
      attendance.markVerified();
    }

    const result = await this._attendanceRepository.update(token.masterId, attendance);

    return AttendanceMapper.toObj(result);
  }
}
