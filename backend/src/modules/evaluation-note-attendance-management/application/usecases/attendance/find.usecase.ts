import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAttendanceInputDto,
  FindAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { AttendanceMapper } from '@/modules/evaluation-note-attendance-management/infrastructure/mapper/attendance.mapper';

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
  constructor(
    attendanceRepository: AttendanceGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
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
    token: TokenData
  ): Promise<FindAttendanceOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ATTENDANCE,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._attendanceRepository.find(token.masterId, id);

    if (response) {
      return AttendanceMapper.toObj(response)
    }

    return null;
  }
}
