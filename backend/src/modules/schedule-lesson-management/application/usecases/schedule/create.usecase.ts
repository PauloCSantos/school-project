import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import {
  CreateScheduleInputDto,
  CreateScheduleOutputDto,
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
export default class CreateSchedule
  implements UseCaseInterface<CreateScheduleInputDto, CreateScheduleOutputDto>
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
    { curriculum, lessonsList, student }: CreateScheduleInputDto,
    token?: TokenData
  ): Promise<CreateScheduleOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SCHEDULE,
      FunctionCalledEnum.CREATE,
      token
    );

    const schedule = new Schedule({
      curriculum,
      lessonsList,
      student,
    });

    const scheduleVerification = await this._scheduleRepository.find(
      schedule.id.value
    );
    if (scheduleVerification) throw new Error('Schedule already exists');

    const result = await this._scheduleRepository.create(schedule);

    return { id: result };
  }
}
