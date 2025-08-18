import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindScheduleInputDto,
  FindScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/application/gateway/schedule.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import ScheduleMapper from '../../mapper/schedule.mapper';

/**
 * Use case responsible for schedule operation.
 */
export default class FindSchedule
  implements
    UseCaseInterface<FindScheduleInputDto, FindScheduleOutputDto | null>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(
    scheduleRepository: ScheduleGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._scheduleRepository = scheduleRepository;
  }
  /**
   * Executes the schedule use case.
   */
  async execute(
    { id }: FindScheduleInputDto,
    token: TokenData
  ): Promise<FindScheduleOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SCHEDULE,
      FunctionCalledEnum.ADD,
      token
    );

    const response = await this._scheduleRepository.find(token.masterId, id);
    if (response) {
      return ScheduleMapper.toObj(response);
    }
    return null;
  }
}
