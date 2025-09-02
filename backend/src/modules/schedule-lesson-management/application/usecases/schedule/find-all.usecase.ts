import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllScheduleInputDto,
  FindAllScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/application/gateway/schedule.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { ScheduleMapper } from '@/modules/schedule-lesson-management/infrastructure/mapper/schedule.mapper';

/**
 * Use case responsible for retrieving a schedule by ID.
 */
export default class FindAllSchedule
  implements UseCaseInterface<FindAllScheduleInputDto, FindAllScheduleOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(
    scheduleRepository: ScheduleGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._scheduleRepository = scheduleRepository;
  }
  /**
   * Fetches a schedule by its unique identifier.
   */
  async execute(
    { quantity, offset }: FindAllScheduleInputDto,
    token: TokenData
  ): Promise<FindAllScheduleOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SCHEDULE,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._scheduleRepository.findAll(
      token.masterId,
      quantity,
      offset
    );

    return ScheduleMapper.toObjList(results);
  }
}
