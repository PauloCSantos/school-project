import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindScheduleInputDto,
  FindScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';

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
  async execute({
    id,
  }: FindScheduleInputDto): Promise<FindScheduleOutputDto | null> {
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
