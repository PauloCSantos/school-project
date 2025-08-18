import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  AddStudentsInputDto,
  AddStudentsOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for adding students to an attendance record.
 *
 * Verifies attendance existence, adds students, and persists changes.
 */
export default class AddStudents
  implements UseCaseInterface<AddStudentsInputDto, AddStudentsOutputDto>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the AddStudents use case.
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
   * Executes the addition of students to an attendance record.
   *
   * @param input - Input data containing the attendance id and list of students to add
   * @returns Output data with the result message
   * @throws Error if the attendance record with the specified id does not exist
   * @throws ValidationError if any student cannot be added due to business rules
   */
  async execute(
    { id, newStudentsList }: AddStudentsInputDto,
    token: TokenData
  ): Promise<AddStudentsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ATTENDANCE,
      FunctionCalledEnum.ADD,
      token
    );

    const attendance = await this._attendanceRepository.find(
      token.masterId,
      id
    );

    if (!attendance) {
      throw new Error('Attendance not found');
    }

    newStudentsList.forEach(studentId => {
      attendance.addStudent(studentId);
    });

    const result = await this._attendanceRepository.addStudent(
      token.masterId,
      id,
      attendance
    );

    return { message: result };
  }
}
