import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import {
  CreateScheduleInputDto,
  CreateScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';

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
      schedule.id.value
    );
    if (scheduleVerification) throw new Error('Schedule already exists');

    const result = await this._scheduleRepository.create(schedule);

    return { id: result };
  }
}
