import {
  CreateScheduleInputDto,
  CreateScheduleOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/modules/schedule-lesson-management/schedule/gateway/schedule.gateway';
import Schedule from '@/modules/schedule-lesson-management/schedule/domain/entity/schedule.entity';

export default class CreateSchedule
  implements UseCaseInterface<CreateScheduleInputDto, CreateScheduleOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    curriculum,
    lessonsList,
    student,
  }: CreateScheduleInputDto): Promise<CreateScheduleOutputDto> {
    const schedule = new Schedule({
      curriculum,
      lessonsList,
      student,
    });

    const scheduleVerification = await this._scheduleRepository.find(
      schedule.id.id
    );
    if (scheduleVerification) throw new Error('Schedule already exists');

    const result = await this._scheduleRepository.create(schedule);

    return { id: result };
  }
}
