import {
  AddStudentsInputDto,
  AddStudentsOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/infraestructure/gateway/schedule-lesson-management/lesson.gateway';
import LessonMapper from '@/application/mapper/schedule-lesson-management/lesson-usecase.mapper';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

export default class AddStudents
  implements UseCaseInterface<AddStudentsInputDto, AddStudentsOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    id,
    newStudentsList,
  }: AddStudentsInputDto): Promise<AddStudentsOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');
    const lessonObj = LessonMapper.toObj(lessonVerification);
    const newLesson = JSON.parse(JSON.stringify(lessonObj));
    const lesson = new Lesson({
      ...newLesson,
      id: new Id(newLesson.id),
    });
    try {
      newStudentsList.forEach(studentId => {
        lesson.addStudent(studentId);
      });
      const result = await this._lessonRepository.addStudents(
        id,
        newStudentsList
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
