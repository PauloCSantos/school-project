import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteScheduleInputDto,
  DeleteScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';

/**
 * Use case responsible for schedule operation.
 */
export default class DeleteSchedule
  implements UseCaseInterface<DeleteScheduleInputDto, DeleteScheduleOutputDto>
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
  }: DeleteScheduleInputDto): Promise<DeleteScheduleOutputDto> {
    const scheduleVerification = await this._scheduleRepository.find(id);
    if (!scheduleVerification) throw new Error('Schedule not found');

    const result = await this._scheduleRepository.delete(id);

    return { message: result };
  }
}