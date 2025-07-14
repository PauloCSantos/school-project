import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveLessonsInputDto,
  RemoveLessonsOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';
import ScheduleMapper from '../../mapper/schedule.mapper';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

/**
 * Use case responsible for removing lessons from a schedule.
 */
export default class RemoveLessons
  implements UseCaseInterface<RemoveLessonsInputDto, RemoveLessonsOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  /**
   * Removes lessons from the specified schedule.
   */
  async execute(
    { id, lessonsListToRemove }: RemoveLessonsInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<RemoveLessonsOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.SCHEDULE,
        FunctionCalledEnum.ADD,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const scheduleVerification = await this._scheduleRepository.find(id);
    if (!scheduleVerification) throw new Error('Schedule not found');
    const scheduleObj = ScheduleMapper.toObj(scheduleVerification);
    const newSchedule = JSON.parse(JSON.stringify(scheduleObj));
    const schedule = new Schedule({
      ...newSchedule,
      id: new Id(newSchedule.id),
    });
    try {
      lessonsListToRemove.forEach(lessonId => {
        schedule.removeLesson(lessonId);
      });
      const result = await this._scheduleRepository.removeLessons(
        id,
        lessonsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
