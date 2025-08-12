import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateAttendanceInputDto,
  CreateAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

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
  constructor(
    attendanceRepository: AttendanceGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
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
  async execute(
    { date, day, hour, lesson, studentsPresent }: CreateAttendanceInputDto,
    token: TokenData
  ): Promise<CreateAttendanceOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ATTENDANCE,
      FunctionCalledEnum.CREATE,
      token
    );
    const attendance = new Attendance({
      date: new Date(date),
      day,
      hour,
      lesson,
      studentsPresent,
    });

    const result = await this._attendanceRepository.create(
      token.masterId,
      attendance
    );

    return { id: result };
  }
}
