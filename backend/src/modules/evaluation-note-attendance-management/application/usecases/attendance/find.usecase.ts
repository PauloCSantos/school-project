import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAttendanceInputDto,
  FindAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

/**
 * Use case responsible for finding an attendance record by id.
 *
 * Retrieves attendance information from the repository and maps it to the appropriate output format.
 */
export default class FindAttendance
  implements
    UseCaseInterface<FindAttendanceInputDto, FindAttendanceOutputDto | null>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the FindAttendance use case.
   *
   * @param attendanceRepository - Gateway implementation for data persistence
   */
  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }

  /**
   * Executes the search for an attendance record by id.
   *
   * @param input - Input data containing the id to search for
   * @returns Attendance data if found, null otherwise
   */
  async execute(
    { id }: FindAttendanceInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindAttendanceOutputDto | null> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.ATTENDANCE,
        FunctionCalledEnum.FIND,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const response = await this._attendanceRepository.find(id);

    if (response) {
      return {
        id: response.id.value,
        lesson: response.lesson,
        date: response.date,
        hour: response.hour,
        day: response.day,
        studentsPresent: response.studentsPresent,
      };
    }

    return null;
  }
}
