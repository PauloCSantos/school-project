import {
  DeleteScheduleInputDto,
  DeleteScheduleOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/modules/schedule-lesson-management/schedule/gateway/schedule.gateway';

export default class DeleteSchedule
  implements UseCaseInterface<DeleteScheduleInputDto, DeleteScheduleOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    id,
  }: DeleteScheduleInputDto): Promise<DeleteScheduleOutputDto> {
    const scheduleVerification = await this._scheduleRepository.find(id);
    if (!scheduleVerification) throw new Error('Schedule not found');

    const result = await this._scheduleRepository.delete(id);

    return { message: result };
  }
}
