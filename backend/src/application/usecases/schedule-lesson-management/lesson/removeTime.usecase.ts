import {
  RemoveTimeInputDto,
  RemoveTimeOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/modules/schedule-lesson-management/lesson/gateway/lesson.gateway';

export default class RemoveTime
  implements UseCaseInterface<RemoveTimeInputDto, RemoveTimeOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    id,
    timesListToRemove,
  }: RemoveTimeInputDto): Promise<RemoveTimeOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');

    try {
      timesListToRemove.forEach(time => {
        lessonVerification.removeTime(time as Hour);
      });
      const result = await this._lessonRepository.removeTime(
        id,
        timesListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
