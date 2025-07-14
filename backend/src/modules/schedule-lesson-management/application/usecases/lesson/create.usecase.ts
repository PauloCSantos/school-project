import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import {
  CreateLessonInputDto,
  CreateLessonOutputDto,
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
 * Use case responsible for creating a new lesson.
 *
 * Validates duplication and persists the lesson entity.
 */
export default class CreateLesson
  implements UseCaseInterface<CreateLessonInputDto, CreateLessonOutputDto>
{
  /** Repository for lesson persistence and retrieval */
  private readonly _lessonRepository: LessonGateway;

  /**
   * Constructs a new instance of the CreateLesson use case.
   *
   * @param lessonRepository - Gateway used for lesson operations
   */
  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Executes the creation of a lesson.
   *
   * @param input - Lesson data to be created
   * @returns Output DTO containing the lesson ID
   * @throws Error if a lesson with the same ID already exists
   */
  async execute(
    {
      days,
      duration,
      name,
      semester,
      studentsList,
      subject,
      teacher,
      times,
    }: CreateLessonInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<CreateLessonOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.LESSON,
        FunctionCalledEnum.CREATE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const lesson = new Lesson({
      days,
      duration,
      name,
      semester,
      studentsList,
      subject,
      teacher,
      times,
    });

    const lessonVerification = await this._lessonRepository.find(
      lesson.id.value
    );

    if (lessonVerification) {
      throw new Error('Lesson already exists');
    }

    const result = await this._lessonRepository.create(lesson);

    return { id: result };
  }
}
