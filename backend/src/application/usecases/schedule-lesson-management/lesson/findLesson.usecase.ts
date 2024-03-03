import {
  FindLessonInputDto,
  FindLessonOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/infraestructure/gateway/schedule-lesson-management/lesson.gateway';

export default class FindLesson
  implements
    UseCaseInterface<FindLessonInputDto, FindLessonOutputDto | undefined>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    id,
  }: FindLessonInputDto): Promise<FindLessonOutputDto | undefined> {
    const response = await this._lessonRepository.find(id);
    if (response) {
      return {
        id: response.id.id,
        name: response.name,
        duration: response.duration,
        teacher: response.teacher,
        studentsList: response.studentList,
        subject: response.subject,
        days: response.days,
        times: response.times,
        semester: response.semester,
      };
    } else {
      return response;
    }
  }
}
