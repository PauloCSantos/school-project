import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import {
  CreateLessonInputDto,
  CreateLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';

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

    const lessonVerification = await this._lessonRepository.find(
      lesson.id.value
    );
    if (lessonVerification) throw new Error('Lesson already exists');

    const result = await this._lessonRepository.create(lesson);

    return { id: result };
  }
}
