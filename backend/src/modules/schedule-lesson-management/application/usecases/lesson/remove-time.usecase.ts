import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { RemoveTimeInputDto, RemoveTimeOutputDto } from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { LessonNotFoundError } from '../../errors/lesson-not-found.error';

/**
 * Use case responsible for removing time slots from a lesson.
 */
export default class RemoveTime
  implements UseCaseInterface<RemoveTimeInputDto, RemoveTimeOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Removes specified time entries from the given lesson.
   */
  async execute(
    { id, timesListToRemove }: RemoveTimeInputDto,
    token: TokenData
  ): Promise<RemoveTimeOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.REMOVE,
      token
    );

    const lesson = await this._lessonRepository.find(token.masterId, id);
    if (!lesson) throw new LessonNotFoundError(id);

    timesListToRemove.forEach(time => {
      lesson.removeTime(time as Hour);
    });
    const result = await this._lessonRepository.removeTime(token.masterId, id, lesson);

    return { message: result };
  }
}
