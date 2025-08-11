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
    token?: TokenData
  ): Promise<FindScheduleOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SCHEDULE,
      FunctionCalledEnum.ADD,
      token
    );

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
