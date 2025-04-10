import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllScheduleInputDto,
  FindAllScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';

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
      id: schedule.id.value,
      student: schedule.student,
      curriculum: schedule.curriculum,
      lessonsList: schedule.lessonsList,
    }));

    return result;
  }
}
