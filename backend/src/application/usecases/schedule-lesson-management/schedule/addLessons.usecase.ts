import {
  AddLessonsInputDto,
  AddLessonsOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/infraestructure/gateway/schedule-lesson-management/schedule.gateway';

export default class AddLessons
  implements UseCaseInterface<AddLessonsInputDto, AddLessonsOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    id,
    newLessonsList,
  }: AddLessonsInputDto): Promise<AddLessonsOutputDto> {
    const scheduleVerification = await this._scheduleRepository.find(id);
    if (!scheduleVerification) throw new Error('Schedule not found');

    try {
      newLessonsList.forEach(lessonId => {
        scheduleVerification.addLesson(lessonId);
      });
      const result = await this._scheduleRepository.addLessons(
        id,
        newLessonsList
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
