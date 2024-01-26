import {
  RemoveLessonsInputDto,
  RemoveLessonsOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/modules/schedule-lesson-management/schedule/gateway/schedule.gateway';

export default class RemoveLessons
  implements UseCaseInterface<RemoveLessonsInputDto, RemoveLessonsOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    id,
    lessonsListToRemove,
  }: RemoveLessonsInputDto): Promise<RemoveLessonsOutputDto> {
    const scheduleVerification = await this._scheduleRepository.find(id);
    if (!scheduleVerification) throw new Error('Schedule not found');
    try {
      lessonsListToRemove.forEach(lessonId => {
        scheduleVerification.removeLesson(lessonId);
      });
      const result = await this._scheduleRepository.removeLessons(
        id,
        lessonsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
