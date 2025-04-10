import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteLessonInputDto,
  DeleteLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';

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
