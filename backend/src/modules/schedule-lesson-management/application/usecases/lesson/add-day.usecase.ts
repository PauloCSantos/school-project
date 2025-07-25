import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { AddDayInputDto, AddDayOutputDto } from '../../dto/lesson-usecase.dto';
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
 * Use case responsible for adding days to a lesson.
 */
export default class AddDay
  implements UseCaseInterface<AddDayInputDto, AddDayOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Adds new days to the specified lesson.
   */
  async execute(
    { id, newDaysList }: AddDayInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<AddDayOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.LESSON,
        FunctionCalledEnum.ADD,
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
    try {
      newDaysList.forEach(day => {
        lesson.addDay(day as DayOfWeek);
      });
      const result = await this._lessonRepository.addDay(id, newDaysList);

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
