import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindLessonInputDto,
  FindLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';

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
        id: response.id.value,
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
