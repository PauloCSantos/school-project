import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindScheduleInputDto,
  FindScheduleOutputDto,
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
export default class FindSchedule
  implements
    UseCaseInterface<FindScheduleInputDto, FindScheduleOutputDto | null>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  /**
   * Executes the schedule use case.
   */
  async execute(
    { id }: FindScheduleInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindScheduleOutputDto | null> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SCHEDULE,
        FunctionCalledEnum.ADD,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const response = await this._scheduleRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        student: response.student,
        curriculum: response.curriculum,
        lessonsList: response.lessonsList,
      };
    } else {
      return response;
    }
  }
}
