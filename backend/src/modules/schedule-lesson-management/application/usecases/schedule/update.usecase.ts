import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateScheduleInputDto,
  UpdateScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/application/gateway/schedule.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for schedule operation.
 */
export default class UpdateSchedule
  implements UseCaseInterface<UpdateScheduleInputDto, UpdateScheduleOutputDto>
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
    { id, curriculum }: UpdateScheduleInputDto,
    token: TokenData
  ): Promise<UpdateScheduleOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SCHEDULE,
      FunctionCalledEnum.ADD,
      token
    );

    const schedule = await this._scheduleRepository.find(token.masterId, id);
    if (!schedule) throw new Error('Schedule not found');
    curriculum !== undefined && (schedule.curriculum = curriculum);

    const result = await this._scheduleRepository.update(
      token.masterId,
      schedule
    );

    return {
      id: result.id.value,
      curriculum: result.curriculum,
    };
  }
}
