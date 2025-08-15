import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveDayInputDto,
  RemoveDayOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for removing days from a lesson.
 */
export default class RemoveDay
  implements UseCaseInterface<RemoveDayInputDto, RemoveDayOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Removes specified days from the given lesson.
   */
  async execute(
    { id, daysListToRemove }: RemoveDayInputDto,
    token: TokenData
  ): Promise<RemoveDayOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.REMOVE,
      token
    );
    const lesson = await this._lessonRepository.find(token.masterId, id);
    if (!lesson) throw new Error('Lesson not found');

    daysListToRemove.forEach(day => {
      lesson.removeDay(day as DayOfWeek);
    });
    const result = await this._lessonRepository.removeDay(
      token.masterId,
      id,
      lesson
    );

    return { message: result };
  }
}
