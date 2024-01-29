import {
  UpdateScheduleInputDto,
  UpdateScheduleOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/infraestructure/gateway/schedule-lesson-management/schedule.gateway';

export default class UpdateSchedule
  implements UseCaseInterface<UpdateScheduleInputDto, UpdateScheduleOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    id,
    curriculum,
  }: UpdateScheduleInputDto): Promise<UpdateScheduleOutputDto> {
    const schedule = await this._scheduleRepository.find(id);
    if (!schedule) throw new Error('Schedule not found');

    curriculum && (schedule.curriculum = curriculum);

    const result = await this._scheduleRepository.update(schedule);

    return {
      curriculum: result.curriculum,
    };
  }
}
