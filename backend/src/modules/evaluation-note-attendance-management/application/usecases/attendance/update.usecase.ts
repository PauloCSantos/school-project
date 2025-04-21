import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateAttendanceInputDto,
  UpdateAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';

/**
 * Use case responsible for updating an attendance record.
 *
 * Verifies attendance existence, applies updates, and persists changes.
 */
export default class UpdateAttendance
  implements
    UseCaseInterface<UpdateAttendanceInputDto, UpdateAttendanceOutputDto>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the UpdateAttendance use case.
   *
   * @param attendanceRepository - Gateway implementation for data persistence
   */
  constructor(attendanceRepository: AttendanceGateway) {
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
  async execute({
    id,
    date,
    day,
    hour,
    lesson,
  }: UpdateAttendanceInputDto): Promise<UpdateAttendanceOutputDto> {
    const attendance = await this._attendanceRepository.find(id);

    if (!attendance) {
      throw new Error('Attendance not found');
    }

    try {
      date !== undefined && (attendance.date = date);
      day !== undefined && (attendance.day = day);
      hour !== undefined && (attendance.hour = hour);
      lesson !== undefined && (attendance.lesson = lesson);

      const result = await this._attendanceRepository.update(attendance);

      return {
        id: result.id.value,
        lesson: result.lesson,
        date: result.date,
        hour: result.hour,
        day: result.day,
      };
    } catch (error) {
      throw error;
    }
  }
}
