import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllScheduleInputDto,
  FindAllScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';

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
  async execute({
    quantity,
    offset,
  }: FindAllScheduleInputDto): Promise<FindAllScheduleOutputDto> {
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
