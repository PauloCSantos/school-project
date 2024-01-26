import {
  AddDayInputDto,
  AddDayOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/modules/schedule-lesson-management/lesson/gateway/lesson.gateway';

export default class AddDay
  implements UseCaseInterface<AddDayInputDto, AddDayOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({ id, newDaysList }: AddDayInputDto): Promise<AddDayOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');

    try {
      newDaysList.forEach(day => {
        lessonVerification.addDay(day as DayOfWeek);
      });
      const result = await this._lessonRepository.addDay(id, newDaysList);

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
