import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindLessonInputDto,
  FindLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';

/**
 * Use case responsible for retrieving a lesson by ID.
 */
export default class FindLesson
  implements UseCaseInterface<FindLessonInputDto, FindLessonOutputDto | null>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Fetches a lesson by ID and returns its details.
   */
  async execute({
    id,
  }: FindLessonInputDto): Promise<FindLessonOutputDto | null> {
    const response = await this._lessonRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        name: response.name,
        duration: response.duration,
        teacher: response.teacher,
        studentsList: response.studentsList,
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
