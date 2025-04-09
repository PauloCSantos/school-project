import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllLessonInputDto,
  FindAllLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';

export default class FindAllLesson
  implements UseCaseInterface<FindAllLessonInputDto, FindAllLessonOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllLessonInputDto): Promise<FindAllLessonOutputDto> {
    const results = await this._lessonRepository.findAll(offset, quantity);

    const result = results.map(lesson => ({
      id: lesson.id.value,
      name: lesson.name,
      duration: lesson.duration,
      teacher: lesson.teacher,
      studentsList: lesson.studentList,
      subject: lesson.subject,
      days: lesson.days,
      times: lesson.times,
      semester: lesson.semester,
    }));

    return result;
  }
}
