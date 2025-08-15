import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveLessonsInputDto,
  RemoveLessonsOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/application/gateway/schedule.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for removing lessons from a schedule.
 */
export default class RemoveLessons
  implements UseCaseInterface<RemoveLessonsInputDto, RemoveLessonsOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(
    scheduleRepository: ScheduleGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._scheduleRepository = scheduleRepository;
  }
  /**
   * Removes lessons from the specified schedule.
   */
  async execute(
    { id, lessonsListToRemove }: RemoveLessonsInputDto,
    token: TokenData
  ): Promise<RemoveLessonsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.SCHEDULE,
      FunctionCalledEnum.ADD,
      token
    );

    const schedule = await this._scheduleRepository.find(token.masterId, id);
    if (!schedule) throw new Error('Schedule not found');

    lessonsListToRemove.forEach(lessonId => {
      schedule.removeLesson(lessonId);
    });
    const result = await this._scheduleRepository.removeLessons(
      token.masterId,
      id,
      schedule
    );

    return { message: result };
  }
}
