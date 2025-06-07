import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  AddTimeInputDto,
  AddTimeOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';
import LessonMapper from '../../mapper/lesson-usecase.mapper';

/**
 * Use case responsible for adding time slots to a lesson.
 */
export default class AddTime
  implements UseCaseInterface<AddTimeInputDto, AddTimeOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Adds new time entries to the specified lesson.
   */
  async execute({
    id,
    newTimesList,
  }: AddTimeInputDto): Promise<AddTimeOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');
    const lessonObj = LessonMapper.toObj(lessonVerification);
    const newLesson = JSON.parse(JSON.stringify(lessonObj));
    const lesson = new Lesson({
      ...newLesson,
      id: new Id(newLesson.id),
    });
    try {
      newTimesList.forEach(time => {
        lesson.addTime(time as Hour);
      });
      const result = await this._lessonRepository.addTime(id, newTimesList);

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
