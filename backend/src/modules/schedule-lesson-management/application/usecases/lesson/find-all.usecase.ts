import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllLessonInputDto,
  FindAllLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for retrieving all lessons with pagination.
 */
export default class FindAllLesson
  implements UseCaseInterface<FindAllLessonInputDto, FindAllLessonOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Fetches all lessons using offset and quantity.
   */
  async execute(
    { offset, quantity }: FindAllLessonInputDto,
    token?: TokenData
  ): Promise<FindAllLessonOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.FIND_ALL,
      token
    );
    const results = await this._lessonRepository.findAll(quantity, offset);

    const result = results.map(lesson => ({
      id: lesson.id.value,
      name: lesson.name,
      duration: lesson.duration,
      teacher: lesson.teacher,
      studentsList: lesson.studentsList,
      subject: lesson.subject,
      days: lesson.days,
      times: lesson.times,
      semester: lesson.semester,
    }));

    return result;
  }
}
