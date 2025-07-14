import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindLessonInputDto,
  FindLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

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
  async execute(
    { id }: FindLessonInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindLessonOutputDto | null> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.LESSON,
        FunctionCalledEnum.FIND,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }
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
