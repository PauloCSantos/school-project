import {
  UpdateLessonInputDto,
  UpdateLessonOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/infraestructure/gateway/schedule-lesson-management/lesson.gateway';

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
        id: result.id.id,
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
