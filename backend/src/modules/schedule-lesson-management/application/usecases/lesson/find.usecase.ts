import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindLessonInputDto,
  FindLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for retrieving a lesson by ID.
 */
export default class FindLesson
  implements UseCaseInterface<FindLessonInputDto, FindLessonOutputDto | null>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Fetches a lesson by ID and returns its details.
   */
  async execute(
    { id }: FindLessonInputDto,
    token?: TokenData
  ): Promise<FindLessonOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.FIND,
      token
    );
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
