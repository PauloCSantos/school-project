import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllScheduleInputDto,
  FindAllScheduleOutputDto,
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
 * Use case responsible for retrieving a schedule by ID.
 */
export default class FindAllSchedule
  implements
    UseCaseInterface<FindAllScheduleInputDto, FindAllScheduleOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  /**
   * Fetches a schedule by its unique identifier.
   */
  async execute(
    { quantity, offset }: FindAllScheduleInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindAllScheduleOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SCHEDULE,
        FunctionCalledEnum.FIND_ALL,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const results = await this._scheduleRepository.findAll(quantity, offset);

    const result = results.map(schedule => ({
      id: schedule.id.value,
      student: schedule.student,
      curriculum: schedule.curriculum,
      lessonsList: schedule.lessonsList,
    }));

    return result;
  }
}
