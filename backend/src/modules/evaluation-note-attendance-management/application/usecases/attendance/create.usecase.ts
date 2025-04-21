import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateAttendanceInputDto,
  CreateAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

/**
 * Use case responsible for creating a new attendance record.
 *
 * Checks for attendance uniqueness and persists the record in the repository.
 */
export default class CreateAttendance
  implements
    UseCaseInterface<CreateAttendanceInputDto, CreateAttendanceOutputDto>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the CreateAttendance use case.
   *
   * @param attendanceRepository - Gateway implementation for data persistence
   */
  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }

  /**
   * Executes the creation of a new attendance record.
   *
   * @param input - Input data including date, day, hour, lesson, and studentsPresent
   * @returns Output data with the id of the created attendance record
   * @throws Error if an attendance record with the same id already exists
   * @throws ValidationError if any of the input data fails validation during entity creation
   */
  async execute({
    date,
    day,
    hour,
    lesson,
    studentsPresent,
  }: CreateAttendanceInputDto): Promise<CreateAttendanceOutputDto> {
    const attendance = new Attendance({
      date,
      day,
      hour,
      lesson,
      studentsPresent,
    });

    const attendanceVerification = await this._attendanceRepository.find(
      attendance.id.value
    );

    if (attendanceVerification) {
      throw new Error('Attendance already exists');
    }

    const result = await this._attendanceRepository.create(attendance);

    return { id: result };
  }
}
