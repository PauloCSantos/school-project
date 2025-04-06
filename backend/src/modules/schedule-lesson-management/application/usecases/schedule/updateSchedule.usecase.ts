import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateScheduleInputDto,
  UpdateScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';

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
    try {
      curriculum !== undefined && (schedule.curriculum = curriculum);

      const result = await this._scheduleRepository.update(schedule);

      return {
        id: result.id.id,
        curriculum: result.curriculum,
      };
    } catch (error) {
      throw error;
    }
  }
}
