import {
  FindScheduleInputDto,
  FindScheduleOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/infraestructure/gateway/schedule-lesson-management/schedule.gateway';

export default class FindSchedule
  implements
    UseCaseInterface<FindScheduleInputDto, FindScheduleOutputDto | undefined>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    id,
  }: FindScheduleInputDto): Promise<FindScheduleOutputDto | undefined> {
    const response = await this._scheduleRepository.find(id);
    if (response) {
      return {
        student: response.student,
        curriculum: response.curriculum,
        lessonsList: response.lessonsList,
      };
    } else {
      return response;
    }
  }
}
