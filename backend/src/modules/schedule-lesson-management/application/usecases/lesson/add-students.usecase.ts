import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  AddStudentsInputDto,
  AddStudentsOutputDto,
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
 * Use case responsible for adding students to a lesson.
 */
export default class AddStudents
  implements UseCaseInterface<AddStudentsInputDto, AddStudentsOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(
    lessonRepository: LessonGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._lessonRepository = lessonRepository;
  }

  /**
   * Adds a list of students to the specified lesson.
   */
  async execute(
    { id, newStudentsList }: AddStudentsInputDto,
    token?: TokenData
  ): Promise<AddStudentsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.LESSON,
      FunctionCalledEnum.ADD,
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

    newStudentsList.forEach(studentId => {
      lesson.addStudent(studentId);
    });
    const result = await this._lessonRepository.addStudents(
      id,
      newStudentsList
    );

    return { message: result };
  }
}
