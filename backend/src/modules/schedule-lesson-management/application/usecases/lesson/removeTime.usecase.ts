import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveTimeInputDto,
  RemoveTimeOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';
import LessonMapper from '../../mapper/lesson-usecase.mapper';

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
    const lessonObj = LessonMapper.toObj(lessonVerification);
    const newLesson = JSON.parse(JSON.stringify(lessonObj));
    const lesson = new Lesson({
      ...newLesson,
      id: new Id(newLesson.id),
    });
    try {
      timesListToRemove.forEach(time => {
        lesson.removeTime(time as Hour);
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
