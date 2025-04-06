import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateLessonInputDto,
  UpdateLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';

export default class UpdateLesson
  implements UseCaseInterface<UpdateLessonInputDto, UpdateLessonOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    id,
    duration,
    name,
    semester,
    subject,
    teacher,
  }: UpdateLessonInputDto): Promise<UpdateLessonOutputDto> {
    const lesson = await this._lessonRepository.find(id);
    if (!lesson) throw new Error('Lesson not found');

    try {
      duration !== undefined && (lesson.duration = duration);
      name !== undefined && (lesson.name = name);
      semester !== undefined && (lesson.semester = semester);
      subject !== undefined && (lesson.subject = subject);
      teacher !== undefined && (lesson.teacher = teacher);

      const result = await this._lessonRepository.update(lesson);

      return {
        id: result.id.value,
        name: result.name,
        duration: result.duration,
        teacher: result.teacher,
        subject: result.subject,
        semester: result.semester,
      };
    } catch (error) {
      throw error;
    }
  }
}
