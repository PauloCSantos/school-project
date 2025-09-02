import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { AddDayInputDto, AddDayOutputDto } from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { LessonNotFoundError } from '../../errors/lesson-not-found.error';

/**
 * Use case responsible for adding days to a lesson.
 */
export default class AddDay implements UseCaseInterface<AddDayInputDto, AddDayOutputDto> {
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Adds new days to the specified lesson.
   */
  async execute(
    { id, newDaysList }: AddDayInputDto,
    token: TokenData
  ): Promise<AddDayOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.ADD,
      token
    );

    const lesson = await this._lessonRepository.find(token.masterId, id);
    if (!lesson) throw new LessonNotFoundError(id);

    newDaysList.forEach(day => {
      lesson.addDay(day as DayOfWeek);
    });
    const result = await this._lessonRepository.addDay(token.masterId, id, lesson);

    return { message: result };
  }
}
