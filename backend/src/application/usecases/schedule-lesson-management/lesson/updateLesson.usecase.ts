import {
  UpdateLessonInputDto,
  UpdateLessonOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/modules/schedule-lesson-management/lesson/gateway/lesson.gateway';

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

    duration && (lesson.duration = duration);
    name && (lesson.name = name);
    semester && (lesson.semester = semester);
    subject && (lesson.subject = subject);
    teacher && (lesson.teacher = teacher);

    const result = await this._lessonRepository.update(lesson);

    return {
      name: result.name,
      duration: result.duration,
      teacher: result.teacher,
      subject: result.subject,
      semester: result.semester,
    };
  }
}
