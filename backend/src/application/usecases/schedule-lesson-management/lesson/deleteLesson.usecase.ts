import {
  DeleteLessonInputDto,
  DeleteLessonOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/modules/schedule-lesson-management/lesson/gateway/lesson.gateway';

export default class DeleteLesson
  implements UseCaseInterface<DeleteLessonInputDto, DeleteLessonOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({ id }: DeleteLessonInputDto): Promise<DeleteLessonOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');

    const result = await this._lessonRepository.delete(id);

    return { message: result };
  }
}
