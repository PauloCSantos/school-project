import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { LessonNotFoundError } from '../../errors/lesson-not-found.error';

/**
 * Use case responsible for removing students from a lesson.
 */
export default class RemoveStudents
  implements UseCaseInterface<RemoveStudentsInputDto, RemoveStudentsOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Removes specified students from the given lesson.
   */
  async execute(
    { id, studentsListToRemove }: RemoveStudentsInputDto,
    token: TokenData
  ): Promise<RemoveStudentsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.REMOVE,
      token
    );

    const lesson = await this._lessonRepository.find(token.masterId, id);
    if (!lesson) throw new LessonNotFoundError(id);

    studentsListToRemove.forEach(studentId => {
      lesson.removeStudent(studentId);
    });
    const result = await this._lessonRepository.removeStudents(
      token.masterId,
      id,
      lesson
    );

    return { message: result };
  }
}
