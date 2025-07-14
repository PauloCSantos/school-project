import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteLessonInputDto,
  DeleteLessonOutputDto,
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
 * Use case responsible for deleting a lesson.
 */
export default class DeleteLesson
  implements UseCaseInterface<DeleteLessonInputDto, DeleteLessonOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Deletes a lesson after verifying its existence.
   */
  async execute(
    { id }: DeleteLessonInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteLessonOutputDto> {
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

    const result = await this._lessonRepository.delete(id);

    return { message: result };
  }
}
