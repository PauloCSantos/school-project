import {
  RemoveDayInputDto,
  RemoveDayOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/infraestructure/gateway/schedule-lesson-management/lesson.gateway';

export default class RemoveDay
  implements UseCaseInterface<RemoveDayInputDto, RemoveDayOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    id,
    daysListToRemove,
  }: RemoveDayInputDto): Promise<RemoveDayOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');

    try {
      daysListToRemove.forEach(day => {
        lessonVerification.removeDay(day as DayOfWeek);
      });
      const result = await this._lessonRepository.removeDay(
        id,
        daysListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
