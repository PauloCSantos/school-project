import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveTimeInputDto,
  RemoveTimeOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/lesson.gateway';
import LessonMapper from '../../mapper/lesson-usecase.mapper';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

/**
 * Use case responsible for removing time slots from a lesson.
 */
export default class RemoveTime
  implements UseCaseInterface<RemoveTimeInputDto, RemoveTimeOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Removes specified time entries from the given lesson.
   */
  async execute(
    { id, timesListToRemove }: RemoveTimeInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<RemoveTimeOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.LESSON,
        FunctionCalledEnum.REMOVE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');
    const lessonObj = LessonMapper.toObj(lessonVerification);
    const newLesson = JSON.parse(JSON.stringify(lessonObj));
    const lesson = new Lesson({
      ...newLesson,
      id: new Id(newLesson.id),
    });

    timesListToRemove.forEach(time => {
      lesson.removeTime(time as Hour);
    });
    const result = await this._lessonRepository.removeTime(
      id,
      timesListToRemove
    );

    return { message: result };
  }
}
