import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for removing students from an attendance record.
 *
 * Verifies attendance existence, removes students, and persists changes.
 */
export default class RemoveStudents
  implements UseCaseInterface<RemoveStudentsInputDto, RemoveStudentsOutputDto>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the RemoveStudents use case.
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
   * Executes the removal of students from an attendance record.
   *
   * @param input - Input data containing the attendance id and list of students to remove
   * @returns Output data with the result message
   * @throws Error if the attendance record with the specified id does not exist
   * @throws ValidationError if any student cannot be removed due to business rules
   */
  async execute(
    { id, studentsListToRemove }: RemoveStudentsInputDto,
    token: TokenData
  ): Promise<RemoveStudentsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ATTENDANCE,
      FunctionCalledEnum.REMOVE,
      token
    );

    const attendance = await this._attendanceRepository.find(
      token.masterId,
      id
    );

    if (!attendance) {
      throw new Error('Attendance not found');
    }

    studentsListToRemove.forEach(studentId => {
      attendance.removeStudent(studentId);
    });

    const result = await this._attendanceRepository.removeStudent(
      token.masterId,
      id,
      attendance
    );

    return { message: result };
  }
}
