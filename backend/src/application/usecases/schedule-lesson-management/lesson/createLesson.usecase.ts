import {
  CreateLessonInputDto,
  CreateLessonOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/infraestructure/gateway/schedule-lesson-management/lesson.gateway';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

export default class CreateLesson
  implements UseCaseInterface<CreateLessonInputDto, CreateLessonOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    days,
    duration,
    name,
    semester,
    studentsList,
    subject,
    teacher,
    times,
  }: CreateLessonInputDto): Promise<CreateLessonOutputDto> {
    const lesson = new Lesson({
      days,
      duration,
      name,
      semester,
      studentsList,
      subject,
      teacher,
      times,
    });

    const lessonVerification = await this._lessonRepository.find(lesson.id.id);
    if (lessonVerification) throw new Error('Lesson already exists');

    const result = await this._lessonRepository.create(lesson);

    return { id: result };
  }
}
