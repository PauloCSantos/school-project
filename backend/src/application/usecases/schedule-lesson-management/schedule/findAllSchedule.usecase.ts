import {
  FindAllScheduleInputDto,
  FindAllScheduleOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/infraestructure/gateway/schedule-lesson-management/schedule.gateway';

export default class FindAllSchedule
  implements
    UseCaseInterface<FindAllScheduleInputDto, FindAllScheduleOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllScheduleInputDto): Promise<FindAllScheduleOutputDto> {
    const results = await this._scheduleRepository.findAll(offset, quantity);

    const result = results.map(schedule => ({
      id: schedule.id.id,
      student: schedule.student,
      curriculum: schedule.curriculum,
      lessonsList: schedule.lessonsList,
    }));

    return result;
  }
}
