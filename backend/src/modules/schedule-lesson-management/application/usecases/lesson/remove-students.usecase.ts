import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
} from '../../dto/lesson-usecase.dto';
import LessonGateway from '@/modules/schedule-lesson-management/application/gateway/lesson.gateway';
import LessonMapper from '../../mapper/lesson-usecase.mapper';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

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
    token?: TokenData
  ): Promise<RemoveStudentsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.REMOVE,
      token
    );

    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');
    const lessonObj = LessonMapper.toObj(lessonVerification);
    const newLesson = JSON.parse(JSON.stringify(lessonObj));
    const lesson = new Lesson({
      ...newLesson,
      id: new Id(newLesson.id),
    });
    studentsListToRemove.forEach(studentId => {
      lesson.removeStudent(studentId);
    });
    const result = await this._lessonRepository.removeStudents(
      id,
      studentsListToRemove
    );

    return { message: result };
  }
}
