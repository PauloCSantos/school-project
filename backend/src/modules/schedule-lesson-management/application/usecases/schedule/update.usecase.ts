import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateScheduleInputDto,
  UpdateScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

/**
 * Use case responsible for schedule operation.
 */
export default class UpdateSchedule
  implements UseCaseInterface<UpdateScheduleInputDto, UpdateScheduleOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  /**
   * Executes the schedule use case.
   */
  async execute(
    { id, curriculum }: UpdateScheduleInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<UpdateScheduleOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SCHEDULE,
        FunctionCalledEnum.ADD,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const schedule = await this._scheduleRepository.find(id);
    if (!schedule) throw new Error('Schedule not found');
    try {
      curriculum !== undefined && (schedule.curriculum = curriculum);

      const result = await this._scheduleRepository.update(schedule);

      return {
        id: result.id.value,
        curriculum: result.curriculum,
      };
    } catch (error) {
      throw error;
    }
  }
}
