import {
  FindAllLessonInputDto,
  FindAllLessonOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/modules/schedule-lesson-management/lesson/gateway/lesson.gateway';

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
