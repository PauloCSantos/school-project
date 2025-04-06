import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindScheduleInputDto,
  FindScheduleOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';

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
        id: response.id.id,
        student: response.student,
        curriculum: response.curriculum,
        lessonsList: response.lessonsList,
      };
    } else {
      return response;
    }
  }
}
