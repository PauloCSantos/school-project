import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteLessonInputDto,
  DeleteLessonOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for deleting a lesson.
 */
export default class DeleteLesson
  implements UseCaseInterface<DeleteLessonInputDto, DeleteLessonOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Deletes a lesson after verifying its existence.
   */
  async execute(
    { id }: DeleteLessonInputDto,
    token?: TokenData
  ): Promise<DeleteLessonOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.REMOVE,
      token
    );

    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');

    const result = await this._lessonRepository.delete(id);

    return { message: result };
  }
}
