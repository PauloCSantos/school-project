import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  AddTimeInputDto,
  AddTimeOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for adding time slots to a lesson.
 */
export default class AddTime
  implements UseCaseInterface<AddTimeInputDto, AddTimeOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Adds new time entries to the specified lesson.
   */
  async execute(
    { id, newTimesList }: AddTimeInputDto,
    token: TokenData
  ): Promise<AddTimeOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.ADD,
      token
    );

    const lesson = await this._lessonRepository.find(token.masterId, id);
    if (!lesson) throw new Error('Lesson not found');

    newTimesList.forEach(time => {
      lesson.addTime(time as Hour);
    });
    const result = await this._lessonRepository.addTime(
      token.masterId,
      id,
      lesson
    );

    return { message: result };
  }
}
