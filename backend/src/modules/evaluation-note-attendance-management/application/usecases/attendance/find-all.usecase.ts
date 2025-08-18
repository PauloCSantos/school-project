import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllAttendanceInputDto,
  FindAllAttendanceOutputDto,
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
 * Use case responsible for retrieving all attendance records with pagination.
 *
 * Retrieves attendance records from the repository and maps them to the appropriate output format.
 */
export default class FindAllAttendance
  implements
    UseCaseInterface<FindAllAttendanceInputDto, FindAllAttendanceOutputDto>
{
  /** Repository for persisting and retrieving attendance records */
  private readonly _attendanceRepository: AttendanceGateway;

  /**
   * Constructs a new instance of the FindAllAttendance use case.
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
   * Executes the retrieval of all attendance records with pagination.
   *
   * @param input - Input data containing offset and quantity for pagination
   * @returns Array of attendance records
   */
  async execute(
    { offset, quantity }: FindAllAttendanceInputDto,
    token: TokenData
  ): Promise<FindAllAttendanceOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ATTENDANCE,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._attendanceRepository.findAll(
      token.masterId,
      quantity,
      offset
    );

    return AttendanceMapper.toObjList(results)
  }
}
