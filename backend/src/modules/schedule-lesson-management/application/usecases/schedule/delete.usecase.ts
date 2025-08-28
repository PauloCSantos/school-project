import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteScheduleInputDto,
  DeleteScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/application/gateway/schedule.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for schedule operation.
 */
export default class DeleteSchedule
  implements UseCaseInterface<DeleteScheduleInputDto, DeleteScheduleOutputDto>
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
    { id }: DeleteScheduleInputDto,
    token: TokenData
  ): Promise<DeleteScheduleOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SCHEDULE,
      FunctionCalledEnum.DELETE,
      token
    );

    const schedule = await this._scheduleRepository.find(token.masterId, id);
    if (!schedule) throw new Error('Schedule not found');
    schedule.deactivate();

    const result = await this._scheduleRepository.delete(token.masterId, schedule);

    return { message: result };
  }
}
